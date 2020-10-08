'use strict'

const zlib = require('zlib')
const {WritableBufferStream} = require('../utils/StreamUtils')

const PREAMBLE = Buffer.from('applitools', 'utf8')
const COMPRESS_BY_RAW_BLOCKS_FORMAT = 3
const DEFLATE_BUFFER_RATE = 0.6

/**
 * @param {Buffer} pixels
 * @param {number} pixelLength
 * @return {Buffer}
 */
const rgbaToAbgrColors = (pixels, pixelLength) => {
  let r, g, b, a
  for (let offset = 0, {length} = pixels; offset < length; offset += pixelLength) {
    r = pixels[offset]
    g = pixels[offset + 1]
    b = pixels[offset + 2]
    a = pixels[offset + 3]

    pixels[offset] = a
    pixels[offset + 1] = b
    pixels[offset + 2] = g
    pixels[offset + 3] = r
  }
  return pixels
}

/**
 * Computes the width and height of the image data contained in the block at the input column and row.
 *
 * @param {{width: number, height: number}} imageSize - The image size in pixels.
 * @param {number} blockSize - The block size for which we would like to compute the image data width and height.
 * @param {number} blockColumn - The block column index
 * @param {number} blockRow - The block row index
 * @return {{width: number, height: number}} - The width and height of the image data contained in the block.
 */
const getActualBlockSize = (imageSize, blockSize, blockColumn, blockRow) => {
  const width = Math.min(imageSize.width - blockColumn * blockSize, blockSize)
  const height = Math.min(imageSize.height - blockRow * blockSize, blockSize)
  return {width, height}
}

/**
 * @param {Buffer} sourcePixels
 * @param {Buffer} targetPixels
 * @param {{width: number, height: number}} imageSize
 * @param {number} pixelLength
 * @param {number} blockSize
 * @param {number} blockColumn
 * @param {number} blockRow
 * @param {number} channel
 * @return {{isIdentical: boolean, buffer: Buffer}}
 */
const compareAndCopyBlockChannelData = (
  sourcePixels,
  targetPixels,
  imageSize,
  pixelLength,
  blockSize,
  blockColumn,
  blockRow,
  channel,
) => {
  let isIdentical = true // initial default

  // Getting the actual amount of data in the block we wish to copy
  const actualBlockSize = getActualBlockSize(imageSize, blockSize, blockColumn, blockRow)

  const actualBlockHeight = actualBlockSize.height
  const actualBlockWidth = actualBlockSize.width

  const stride = imageSize.width * pixelLength

  // The number of bytes actually contained in the block for the current channel (might be less
  // than blockSize*blockSize)
  const channelBytes = Buffer.alloc(actualBlockHeight * actualBlockWidth)
  let channelBytesOffset = 0

  // Actually comparing and copying the pixels
  let sourceByte, targetByte
  for (let h = 0; h < actualBlockHeight; h += 1) {
    let offset =
      (blockSize * blockRow + h) * stride + blockSize * blockColumn * pixelLength + channel
    for (let w = 0; w < actualBlockWidth; w += 1) {
      sourceByte = sourcePixels[offset]
      targetByte = targetPixels[offset]
      if (sourceByte !== targetByte) {
        isIdentical = false
      }

      channelBytes[channelBytesOffset] = targetByte
      channelBytesOffset += 1
      offset += pixelLength
    }
  }

  return {
    isIdentical,
    buffer: channelBytes,
  }
}

/**
 * Provides image compression based on delta between consecutive images
 */
class ImageDeltaCompressor {
  /**
   * Compresses a target image based on a difference from a source image.
   *
   * @param {Image|png.Image} targetData - The image we want to compress.
   * @param {Buffer} targetBuffer - The image we want to compress in its png buffer representation.
   * @param {Image|png.Image} sourceData - The baseline image by which a compression will be performed.
   * @param {number} [blockSize=10] - How many pixels per block.
   * @return {Buffer} - The compression result.
   */
  static compressByRawBlocks(targetData, targetBuffer, sourceData, blockSize = 10) {
    // If there's no image to compare to, or the images are in different
    // sizes, we simply return the encoded target.
    if (
      !targetData ||
      !sourceData ||
      sourceData.width !== targetData.width ||
      sourceData.height !== targetData.height
    ) {
      return targetBuffer
    }

    // The number of bytes comprising a pixel (depends if there's an Alpha channel).
    // targetData.data[6] bits: 1 palette, 2 color, 4 alpha
    // IMPORTANT: png-async always return data in following format RGBA.
    const pixelLength = 4
    const imageSize = {width: targetData.width, height: targetData.height}

    // IMPORTANT: Notice that the pixel bytes are (A)BGR!
    const targetPixels = rgbaToAbgrColors(targetData.data, pixelLength)
    const sourcePixels = rgbaToAbgrColors(sourceData.data, pixelLength)

    // Calculating how many block columns and rows we've got.
    const blockColumnsCount = Math.trunc(
      targetData.width / blockSize + (targetData.width % blockSize === 0 ? 0 : 1),
    )
    const blockRowsCount = Math.trunc(
      targetData.height / blockSize + (targetData.height % blockSize === 0 ? 0 : 1),
    )

    // Writing the header
    const stream = new WritableBufferStream()
    const blocksStream = new WritableBufferStream()
    stream.write(PREAMBLE)
    stream.write(Buffer.from([COMPRESS_BY_RAW_BLOCKS_FORMAT]))

    // since we don't have a source ID, we write 0 length (Big endian).
    stream.writeShort(0)
    // Writing the block size (Big endian)
    stream.writeShort(blockSize)

    let compareResult
    for (let channel = 0; channel < 3; channel += 1) {
      // The image is RGB, so all that's left is to skip the Alpha channel if there is one.
      const actualChannelIndex = pixelLength === 4 ? channel + 1 : channel

      let blockNumber = 0
      for (let blockRow = 0; blockRow < blockRowsCount; blockRow += 1) {
        for (let blockColumn = 0; blockColumn < blockColumnsCount; blockColumn += 1) {
          compareResult = compareAndCopyBlockChannelData(
            sourcePixels,
            targetPixels,
            imageSize,
            pixelLength,
            blockSize,
            blockColumn,
            blockRow,
            actualChannelIndex,
          )

          if (!compareResult.isIdentical) {
            blocksStream.writeByte(channel)
            blocksStream.writeInt(blockNumber)
            blocksStream.write(compareResult.buffer)

            // If the number of bytes already written is greater then the number of bytes for the
            // uncompressed target, we just return the uncompressed target.
            // NOTE: we need take in account that it will be compressed at the end by zlib
            if (
              stream.getBuffer().length + blocksStream.getBuffer().length * DEFLATE_BUFFER_RATE >
              targetBuffer.length
            ) {
              return targetBuffer
            }
          }

          blockNumber += 1
        }
      }
    }

    const blocksBuffer = zlib.deflateRawSync(blocksStream.getBuffer(), {
      level: zlib.Z_BEST_COMPRESSION,
    })
    stream.write(blocksBuffer)

    if (stream.getBuffer().length > targetBuffer.length) {
      return targetBuffer
    }

    return stream.getBuffer()
  }
}

module.exports = ImageDeltaCompressor
