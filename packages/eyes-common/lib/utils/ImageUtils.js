'use strict';

const png = require('png-async');

const { ArgumentGuard } = require('../utils/ArgumentGuard');
const { ReadableBufferStream, WritableBufferStream } = require('../utils/StreamUtils');

const QUARTER_OF_CIRCLE_DEGREES = 90;

/**
 * Provide means of image manipulations.
 *
 * @ignore
 */
class ImageUtils {
  /**
   * Processes a PNG buffer - returns it as parsed Image.
   *
   * @param {Buffer} buffer - Original image as PNG Buffer
   * @return {Promise<png.Image|Image>} - Decoded png image with byte buffer
   */
  static parseImage(buffer) {
    return new Promise((resolve) => {
      // pass the file to PNG using read stream
      const imageReadableStream = new ReadableBufferStream(buffer, undefined);
      const image = new png.Image({ filterType: 4 });
      // noinspection JSUnresolvedFunction
      return imageReadableStream.pipe(image).on('parsed', () => resolve(image));
    });
  }

  /**
   * Repacks a parsed Image to a PNG buffer.
   *
   * @param {png.Image|Image} image - Parsed image as returned from parseImage
   * @return {Promise<Buffer>} - PNG buffer which can be written to file or base64 string
   */
  static packImage(image) {
    return new Promise((resolve) => {
      // Write back to a temp png file
      const imageWritableStream = new WritableBufferStream();
      // noinspection JSUnresolvedFunction
      return image.pack().pipe(imageWritableStream)
        .on('finish', () => resolve(imageWritableStream.getBuffer()));
    });
  }

  /**
   * Create a new empty image of given size
   *
   * @param {number} width
   * @param {number} height
   * @return {png.Image|Image}
   */
  static createImage(width, height) {
    // noinspection JSValidateTypes
    return new png.Image({ filterType: 4, width, height });
  }

  /**
   * Scaled a parsed image by a given factor.
   *
   * @param {png.Image|Image} image - will be modified
   * @param {number} scaleRatio - factor to multiply the image dimensions by (lower than 1 for scale down)
   * @return {Promise<png.Image|Image>}
   */
  static scaleImage(image, scaleRatio) {
    if (scaleRatio === 1) {
      return new Promise((resolve) => {
        resolve(image);
      });
    }

    const ratio = image.height / image.width;
    const scaledWidth = Math.ceil(image.width * scaleRatio);
    const scaledHeight = Math.ceil(scaledWidth * ratio);
    return ImageUtils.resizeImage(image, scaledWidth, scaledHeight);
  }

  /**
   * Resize a parsed image by a given dimensions.
   *
   * @param {png.Image|Image} image - will be modified
   * @param {number} targetWidth - The width to resize the image to
   * @param {number} targetHeight - The height to resize the image to
   * @return {Promise<png.Image|Image>}
   */
  static resizeImage(image, targetWidth, targetHeight) {
    return new Promise((resolve) => {
      const dst = {
        data: Buffer.alloc(targetWidth * targetHeight * 4),
        width: targetWidth,
        height: targetHeight,
      };

      if (dst.width > image.width || dst.height > image.height) {
        ImageUtils._doBicubicInterpolation(image, dst);
      } else {
        ImageUtils._scaleImageIncrementally(image, dst);
      }

      image.data = dst.data;
      image.width = dst.width;
      image.height = dst.height;
      resolve(image);
    });
  }

  static _interpolateCubic(x0, x1, x2, x3, t) {
    const a0 = (x3 - x2 - x0) + x1;
    const a1 = x0 - x1 - a0;
    const a2 = x2 - x0;
    // noinspection MagicNumberJS
    return Math.ceil(Math.max(0, Math.min(255, (a0 * (t * t * t)) + (a1 * (t * t)) + ((a2 * t) + x1))));
  }

  static _interpolateRows(bufSrc, wSrc, hSrc, wDst) {
    const buf = Buffer.alloc(wDst * hSrc * 4);
    for (let i = 0; i < hSrc; i += 1) {
      for (let j = 0; j < wDst; j += 1) {
        const x = (j * (wSrc - 1)) / wDst;
        const xPos = Math.floor(x);
        const t = x - xPos;
        const srcPos = ((i * wSrc) + xPos) * 4;
        const buf1Pos = ((i * wDst) + j) * 4;
        for (let k = 0; k < 4; k += 1) {
          const kPos = srcPos + k;
          const x0 = xPos > 0 ? bufSrc[kPos - 4] : (2 * bufSrc[kPos]) - bufSrc[kPos + 4];
          const x1 = bufSrc[kPos];
          const x2 = bufSrc[kPos + 4];
          const x3 = xPos < wSrc - 2 ? bufSrc[kPos + 8] : (2 * bufSrc[kPos + 4]) - bufSrc[kPos];
          buf[buf1Pos + k] = ImageUtils._interpolateCubic(x0, x1, x2, x3, t);
        }
      }
    }

    return buf;
  }

  static _interpolateColumns(bufSrc, hSrc, wDst, hDst) {
    const buf = Buffer.alloc(wDst * hDst * 4);
    for (let i = 0; i < hDst; i += 1) {
      for (let j = 0; j < wDst; j += 1) {
        const y = (i * (hSrc - 1)) / hDst;
        // noinspection JSSuspiciousNameCombination
        const yPos = Math.floor(y);
        const t = y - yPos;
        const buf1Pos = ((yPos * wDst) + j) * 4;
        const buf2Pos = ((i * wDst) + j) * 4;
        for (let k = 0; k < 4; k += 1) {
          const kPos = buf1Pos + k;
          const y0 = yPos > 0 ? bufSrc[kPos - (wDst * 4)] : (2 * bufSrc[kPos]) - bufSrc[kPos + (wDst * 4)];
          const y1 = bufSrc[kPos];
          const y2 = bufSrc[kPos + (wDst * 4)];
          const y3 = yPos < hSrc - 2 ? bufSrc[kPos + (wDst * 8)] : (2 * bufSrc[kPos + (wDst * 4)]) - bufSrc[kPos];
          // noinspection JSSuspiciousNameCombination
          buf[buf2Pos + k] = ImageUtils._interpolateCubic(y0, y1, y2, y3, t);
        }
      }
    }

    return buf;
  }

  static _interpolateScale(bufColumns, wDst, hDst, wDst2, m, wM, hM) {
    const buf = Buffer.alloc(wDst * hDst * 4);
    for (let i = 0; i < hDst; i += 1) {
      for (let j = 0; j < wDst; j += 1) {
        let r = 0;
        let g = 0;
        let b = 0;
        let a = 0;
        let realColors = 0;
        for (let y = 0; y < hM; y += 1) {
          const yPos = (i * hM) + y;
          for (let x = 0; x < wM; x += 1) {
            const xPos = (j * wM) + x;
            const xyPos = ((yPos * wDst2) + xPos) * 4;
            const pixelAlpha = bufColumns[xyPos + 3];
            if (pixelAlpha) {
              r += bufColumns[xyPos];
              g += bufColumns[xyPos + 1];
              b += bufColumns[xyPos + 2];
              realColors += 1;
            }
            a += pixelAlpha;
          }
        }

        const pos = ((i * wDst) + j) * 4;
        buf[pos] = realColors ? Math.round(r / realColors) : 0;
        buf[pos + 1] = realColors ? Math.round(g / realColors) : 0;
        buf[pos + 2] = realColors ? Math.round(b / realColors) : 0;
        buf[pos + 3] = Math.round(a / m);
      }
    }

    return buf;
  }

  static _doBicubicInterpolation(src, dst) {
    // The implementation was taken from
    // https://github.com/oliver-moran/jimp/blob/master/resize2.js

    // when dst smaller than src/2, interpolate first to a multiple between 0.5 and 1.0 src, then sum squares
    const wM = Math.max(1, Math.floor(src.width / dst.width));
    const wDst2 = dst.width * wM;
    const hM = Math.max(1, Math.floor(src.height / dst.height));
    const hDst2 = dst.height * hM;

    // Pass 1 - interpolate rows
    // bufRows has width of dst2 and height of src
    const bufRows = ImageUtils._interpolateRows(src.data, src.width, src.height, wDst2);

    // Pass 2 - interpolate columns
    // bufColumns has width and height of dst2
    const bufColumns = ImageUtils._interpolateColumns(bufRows, src.height, wDst2, hDst2);

    // Pass 3 - scale to dst
    const m = wM * hM;
    if (m > 1) {
      dst.data = ImageUtils._interpolateScale(bufColumns, dst.width, dst.height, wDst2, m, wM, hM);
    } else {
      dst.data = bufColumns;
    }

    return dst;
  }

  static _scaleImageIncrementally(src, dst) {
    let currentWidth = src.width;
    let currentHeight = src.height;
    const targetWidth = dst.width;
    const targetHeight = dst.height;

    dst.data = src.data;
    dst.width = src.width;
    dst.height = src.height;

    // For ultra quality should use 7
    const fraction = 2;

    do {
      const prevCurrentWidth = currentWidth;
      const prevCurrentHeight = currentHeight;

      // If the current width is bigger than our target, cut it in half and sample again.
      if (currentWidth > targetWidth) {
        currentWidth -= currentWidth / fraction;

        // If we cut the width too far it means we are on our last iteration. Just set it to the target width
        // and finish up.
        if (currentWidth < targetWidth) {
          currentWidth = targetWidth;
        }
      }

      // If the current height is bigger than our target, cut it in half and sample again.
      if (currentHeight > targetHeight) {
        currentHeight -= currentHeight / fraction;

        // If we cut the height too far it means we are on our last iteration. Just set it to the target height
        // and finish up.
        if (currentHeight < targetHeight) {
          currentHeight = targetHeight;
        }
      }

      // Stop when we cannot incrementally step down anymore.
      if (prevCurrentWidth === currentWidth && prevCurrentHeight === currentHeight) {
        return dst;
      }

      // Render the incremental scaled image.
      const incrementalImage = {
        data: Buffer.alloc(currentWidth * currentHeight * 4),
        width: currentWidth,
        height: currentHeight,
      };
      ImageUtils._doBicubicInterpolation(dst, incrementalImage);

      // Now treat our incremental partially scaled image as the src image
      // and cycle through our loop again to do another incremental scaling of it (if necessary).
      dst.data = incrementalImage.data;
      dst.width = incrementalImage.width;
      dst.height = incrementalImage.height;
    } while (currentWidth !== targetWidth || currentHeight !== targetHeight);

    return dst;
  }

  /**
   * Crops a parsed image - the image is changed
   *
   * @param {png.Image|Image} image
   * @param {Region} region - Region to crop
   * @return {Promise<png.Image|Image>}
   */
  static cropImage(image, region) {
    return new Promise((resolve, reject) => {
      if (!region) {
        return resolve(image);
      }

      if (
        region.getTop() < 0 ||
        region.getTop() >= image.height ||
        region.getLeft() < 0 ||
        region.getLeft() >= image.width
      ) {
        return reject(new Error('region is outside the image bounds!'));
      }

      // process the pixels - crop
      const croppedArray = [];
      const yStart = region.getTop();
      const yEnd = Math.min(region.getTop() + region.getHeight(), image.height);
      const xStart = region.getLeft();
      const xEnd = Math.min(region.getLeft() + region.getWidth(), image.width);

      let y, x, idx, i;
      for (y = yStart; y < yEnd; y += 1) {
        for (x = xStart; x < xEnd; x += 1) {
          idx = ((image.width * y) + x) * 4;
          for (i = 0; i < 4; i += 1) {
            croppedArray.push(image.data[idx + i]);
          }
        }
      }

      image.data = Buffer.from(croppedArray);
      image.width = xEnd - xStart;
      image.height = yEnd - yStart;

      return resolve(image);
    });
  }

  /**
   * Rotates an image clockwise by a number of degrees rounded to the nearest 90 degrees.
   *
   * @param {png.Image|Image} image - A parsed image, the image will be changed
   * @param {number} degrees - The number of degrees to rotate the image by
   * @return {Promise<png.Image|Image>}
   */
  static async rotateImage(image, degrees) {
    ArgumentGuard.notNull(image, 'image');
    ArgumentGuard.isInteger(degrees, 'deg');

    let i = Math.round(degrees / QUARTER_OF_CIRCLE_DEGREES) % 4;
    while (i < 0) {
      i += 4;
    }

    while (i > 0) {
      const dstBuffer = Buffer.alloc(image.data.length);
      let dstOffset = 0;
      for (let x = 0; x < image.width; x += 1) {
        for (let y = image.height - 1; y >= 0; y -= 1) {
          const srcOffset = ((image.width * y) + x) * 4;
          const data = image.data.readUInt32BE(srcOffset);
          dstBuffer.writeUInt32BE(data, dstOffset);
          dstOffset += 4;
        }
      }

      image.data = Buffer.from(dstBuffer);
      const tmp = image.width;
      // noinspection JSSuspiciousNameCombination
      image.width = image.height;
      image.height = tmp;

      i -= 1;
    }

    return image;
  }

  /**
   * Copies pixels from the source image to the destination image.
   *
   * @param {png.Image|Image} dstImage - The destination image.
   * @param {{x: number, y: number}} dstPosition - The pixel which is the starting point to copy to.
   * @param {png.Image|Image} srcImage - The source image.
   * @param {{x: number, y: number}} srcPosition - The pixel from which to start copying.
   * @param {{width: number, height: number}} size - The region to be copied.
   */
  static copyPixels(dstImage, dstPosition, srcImage, srcPosition, size) {
    let y, dstY, srcY, x, dstX, srcX, dstIndex, srcIndex;

    // Fix the problem when src image was out of dst image and pixels was copied to wrong position in dst image.
    const maxHeight = dstPosition.y + size.height <= dstImage.height ? size.height : dstImage.height - dstPosition.y;
    const maxWidth = dstPosition.x + size.width <= dstImage.width ? size.width : dstImage.width - dstPosition.x;
    for (y = 0; y < maxHeight; y += 1) {
      dstY = dstPosition.y + y;
      srcY = srcPosition.y + y;

      for (x = 0; x < maxWidth; x += 1) {
        dstX = dstPosition.x + x;
        srcX = srcPosition.x + x;

        // Since each pixel is composed of 4 values (RGBA) we multiply each index by 4.
        dstIndex = ((dstY * dstImage.width) + dstX) * 4;
        srcIndex = ((srcY * srcImage.width) + srcX) * 4;

        dstImage.data[dstIndex] = srcImage.data[srcIndex];
        dstImage.data[dstIndex + 1] = srcImage.data[srcIndex + 1];
        dstImage.data[dstIndex + 2] = srcImage.data[srcIndex + 2];
        dstImage.data[dstIndex + 3] = srcImage.data[srcIndex + 3];
      }
    }
  }

  /**
   * Get png size from image buffer. Don't require parsing the image
   *
   * @param {Buffer} imageBuffer
   * @return {{width: number, height: number}}
   */
  static getImageSizeFromBuffer(imageBuffer) {
    // noinspection MagicNumberJS
    if (imageBuffer[12] === 0x49 && imageBuffer[13] === 0x48 && imageBuffer[14] === 0x44 && imageBuffer[15] === 0x52) {
      // noinspection MagicNumberJS
      const width =
        (imageBuffer[16] * 256 * 256 * 256) + (imageBuffer[17] * 256 * 256) + (imageBuffer[18] * 256) + imageBuffer[19];
      // noinspection MagicNumberJS
      const height =
        (imageBuffer[20] * 256 * 256 * 256) + (imageBuffer[21] * 256 * 256) + (imageBuffer[22] * 256) + imageBuffer[23];
      return { width, height };
    }

    throw new TypeError('Buffer contains unsupported image type.');
  }
}

exports.ImageUtils = ImageUtils;
