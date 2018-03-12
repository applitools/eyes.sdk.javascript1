'use strict';

const fs = require('fs');
const png = require('png-async');

const ArgumentGuard = require('../ArgumentGuard');
const {ReadableBufferStream, WritableBufferStream} = require('../utils/StreamUtils');

/**
 * Provide means of image manipulations.
 */
class ImageUtils {

    /**
     * Processes a PNG buffer - returns it as parsed Image.
     *
     * @param {Buffer} buffer Original image as PNG Buffer
     * @param {PromiseFactory} promiseFactory
     * @return {Promise.<png.Image>} Decoded png image with byte buffer
     **/
    static parseImage(buffer, promiseFactory) {
        return promiseFactory.makePromise(resolve => {
            if (!fs.open) {
                return resolve(buffer);
            }

            // pass the file to PNG using read stream
            const imageReadableStream = new ReadableBufferStream(buffer, undefined);
            const image = new png.Image({filterType: 4});
            // noinspection JSUnresolvedFunction
            imageReadableStream.pipe(image).on('parsed', () => {
                resolve(image);
            });
        });
    }

    /**
     * Repacks a parsed Image to a PNG buffer.
     *
     * @param {png.Image} image Parsed image as returned from parseImage
     * @param {PromiseFactory} promiseFactory
     * @return {Promise.<Buffer>} PNG buffer which can be written to file or base64 string
     **/
    static packImage(image, promiseFactory) {
        return promiseFactory.makePromise(resolve => {
            if (!fs.open) {
                return resolve(image);
            }

            // Write back to a temp png file
            const imageWritableStream = new WritableBufferStream();
            // noinspection JSUnresolvedFunction
            image.pack().pipe(imageWritableStream).on('finish', () => {
                resolve(imageWritableStream.getBuffer());
            });
        });
    }

    /**
     * Create a new empty image of given size
     *
     * @param width
     * @param height
     * @return {png.Image}
     **/
    static createImage(width, height) {
        // noinspection JSValidateTypes
        return new png.Image({filterType: 4, width: width, height: height});
    }

    /**
     * Scaled a parsed image by a given factor.
     *
     * @param {png.Image} image - will be modified
     * @param {Number} scaleRatio factor to multiply the image dimensions by (lower than 1 for scale down)
     * @param {PromiseFactory} promiseFactory
     * @return {Promise}
     **/
    static scaleImage(image, scaleRatio, promiseFactory) {
        if (scaleRatio === 1) {
            return promiseFactory.makePromise(resolve => {
                resolve(image);
            });
        }

        const ratio = image.height / image.width;
        const scaledWidth = Math.ceil(image.width * scaleRatio);
        const scaledHeight = Math.ceil(scaledWidth * ratio);
        return ImageUtils.resizeImage(image, scaledWidth, scaledHeight, promiseFactory);
    }

    /**
     * Resize a parsed image by a given dimensions.
     *
     * @param {png.Image} image - will be modified
     * @param {int} targetWidth The width to resize the image to
     * @param {int} targetHeight The height to resize the image to
     * @param {PromiseFactory} promiseFactory
     * @return {Promise}
     **/
    static resizeImage(image, targetWidth, targetHeight, promiseFactory) {
        return promiseFactory.makePromise(resolve => {
            const dst = {
                data: new Buffer(targetWidth * targetHeight * 4),
                width: targetWidth,
                height: targetHeight
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
    };

    static _interpolateCubic(x0, x1, x2, x3, t) {
        const a0 = x3 - x2 - x0 + x1;
        const a1 = x0 - x1 - a0;
        const a2 = x2 - x0;
        // noinspection MagicNumberJS
        return Math.ceil(Math.max(0, Math.min(255, (a0 * (t * t * t)) + (a1 * (t * t)) + (a2 * t) + (x1))));
    }

    static _interpolateRows(bufSrc, wSrc, hSrc, wDst) {
        const buf = new Buffer(wDst * hSrc * 4);
        for (let i = 0; i < hSrc; i++) {
            for (let j = 0; j < wDst; j++) {
                const x = j * (wSrc - 1) / wDst;
                const xPos = Math.floor(x);
                const t = x - xPos;
                const srcPos = (i * wSrc + xPos) * 4;
                const buf1Pos = (i * wDst + j) * 4;
                for (let k = 0; k < 4; k++) {
                    const kPos = srcPos + k;
                    const x0 = (xPos > 0) ? bufSrc[kPos - 4] : 2 * bufSrc[kPos] - bufSrc[kPos + 4];
                    const x1 = bufSrc[kPos];
                    const x2 = bufSrc[kPos + 4];
                    const x3 = (xPos < wSrc - 2) ? bufSrc[kPos + 8] : 2 * bufSrc[kPos + 4] - bufSrc[kPos];
                    buf[buf1Pos + k] = ImageUtils._interpolateCubic(x0, x1, x2, x3, t);
                }
            }
        }

        return buf;
    }

    static _interpolateColumns(bufSrc, hSrc, wDst, hDst) {
        const buf = new Buffer(wDst * hDst * 4);
        for (let i = 0; i < hDst; i++) {
            for (let j = 0; j < wDst; j++) {
                const y = i * (hSrc - 1) / hDst;
                // noinspection JSSuspiciousNameCombination
                const yPos = Math.floor(y);
                const t = y - yPos;
                const buf1Pos = (yPos * wDst + j) * 4;
                const buf2Pos = (i * wDst + j) * 4;
                for (let k = 0; k < 4; k++) {
                    const kPos = buf1Pos + k;
                    const y0 = (yPos > 0) ? bufSrc[kPos - wDst * 4] : 2 * bufSrc[kPos] - bufSrc[kPos + wDst * 4];
                    const y1 = bufSrc[kPos];
                    const y2 = bufSrc[kPos + wDst * 4];
                    const y3 = (yPos < hSrc - 2) ? bufSrc[kPos + wDst * 8] : 2 * bufSrc[kPos + wDst * 4] - bufSrc[kPos];
                    // noinspection JSSuspiciousNameCombination
                    buf[buf2Pos + k] = ImageUtils._interpolateCubic(y0, y1, y2, y3, t);
                }
            }
        }

        return buf;
    }

    static _interpolateScale(bufColumns, wDst, hDst, wDst2, m, wM, hM) {
        const buf = new Buffer(wDst * hDst * 4);
        for (let i = 0; i < hDst; i++) {
            for (let j = 0; j < wDst; j++) {
                let r = 0, g = 0, b = 0, a = 0, realColors = 0;
                for (let y = 0; y < hM; y++) {
                    const yPos = i * hM + y;
                    for (let x = 0; x < wM; x++) {
                        const xPos = j * wM + x;
                        const xyPos = (yPos * wDst2 + xPos) * 4;
                        const pixelAlpha = bufColumns[xyPos + 3];
                        if (pixelAlpha) {
                            r += bufColumns[xyPos];
                            g += bufColumns[xyPos + 1];
                            b += bufColumns[xyPos + 2];
                            realColors++;
                        }
                        a += pixelAlpha;
                    }
                }

                const pos = (i * wDst + j) * 4;
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
            dst.data = ImageUtils._interpolateScale(bufColumns, dst.width, dst.height, wDst2, m, wM, hM)
        } else {
            dst.data = bufColumns;
        }

        return dst;
    }

    static _scaleImageIncrementally(src, dst) {
        let incrementCount = 0;
        let currentWidth = src.width, currentHeight = src.height;
        const targetWidth = dst.width, targetHeight = dst.height;

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
                currentWidth -= (currentWidth / fraction);

                // If we cut the width too far it means we are on our last iteration. Just set it to the target width and finish up.
                if (currentWidth < targetWidth) {
                    currentWidth = targetWidth;
                }
            }

            // If the current height is bigger than our target, cut it in half and sample again.
            if (currentHeight > targetHeight) {
                currentHeight -= (currentHeight / fraction);

                // If we cut the height too far it means we are on our last iteration. Just set it to the target height and finish up.
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
                data: new Buffer(currentWidth * currentHeight * 4),
                width: currentWidth,
                height: currentHeight
            };
            ImageUtils._doBicubicInterpolation(dst, incrementalImage);

            // Now treat our incremental partially scaled image as the src image
            // and cycle through our loop again to do another incremental scaling of it (if necessary).
            dst.data = incrementalImage.data;
            dst.width = incrementalImage.width;
            dst.height = incrementalImage.height;

            // Track how many times we go through this cycle to scale the image.
            incrementCount++;
        } while (currentWidth !== targetWidth || currentHeight !== targetHeight);

        return dst;
    }

    /**
     * Crops a parsed image - the image is changed
     *
     * @param {png.Image} image
     * @param {Region} region Region to crop
     * @param {PromiseFactory} promiseFactory
     * @return {Promise.<png.Image>}
     **/
    static cropImage(image, region, promiseFactory) {
        return promiseFactory.makePromise((resolve, reject) => {
            if (!region) {
                return resolve(image);
            }

            if (region.getTop() < 0 || region.getTop() >= image.height || region.getLeft() < 0 || region.getLeft() >= image.width) {
                return reject(new Error('region is outside the image bounds!'));
            }

            // process the pixels - crop
            const croppedArray = [];
            const yStart = region.getTop();
            const yEnd = Math.min(region.getTop() + region.getHeight(), image.height);
            const xStart = region.getLeft();
            const xEnd = Math.min(region.getLeft() + region.getWidth(), image.width);

            let y, x, idx, i;
            for (y = yStart; y < yEnd; y++) {
                for (x = xStart; x < xEnd; x++) {
                    idx = (image.width * y + x) << 2;
                    for (i = 0; i < 4; i++) {
                        croppedArray.push(image.data[idx + i]);
                    }
                }
            }

            image.data = new Buffer(croppedArray);
            image.width = xEnd - xStart;
            image.height = yEnd - yStart;

            resolve(image);
        });
    }

    /**
     * Rotates a parsed image - the image is changed
     *
     * @param {png.Image} image
     * @param {Number} deg how many degrees to rotate (in actuality it's only by multipliers of 90)
     * @param {PromiseFactory} promiseFactory
     * @return {Promise.<png.Image>}
     **/
    static rotateImage(image, deg, promiseFactory) {
        ArgumentGuard.notNull(image, "image");
        ArgumentGuard.isInteger(deg, "deg");

        // TODO: refactor it
        return promiseFactory.makePromise(resolve => {
            // noinspection MagicNumberJS
            if (deg % 360 === 0) {
                return resolve(image);
            }

            // noinspection MagicNumberJS
            let i = Math.round(deg / 90) % 4;
            if (i < 0) {
                i += 4;
            }

            while (i > 0) {
                const buffer = new Buffer(image.data.length);
                let offset = 0;
                for (let x = 0; x < image.width; x++) {
                    for (let y = image.height - 1; y >= 0; y--) {
                        const idx = (image.width * y + x) << 2;
                        // TODO: remove buffers `noAssert` argument
                        const data = image.data.readUInt32BE(idx, true);
                        buffer.writeUInt32BE(data, offset, true);
                        offset += 4;
                    }
                }

                image.data = Buffer.from(buffer);
                const tmp = image.width;
                //noinspection JSSuspiciousNameCombination
                image.width = image.height;
                image.height = tmp;

                i--;
            }

            return resolve(image);
        });
    }

    /**
     * Copies pixels from the source image to the destination image.
     *
     * @param {png.Image} dstImage The destination image.
     * @param {{x: number, y: number}} dstPosition The pixel which is the starting point to copy to.
     * @param {png.Image} srcImage The source image.
     * @param {{x: number, y: number}} srcPosition The pixel from which to start copying.
     * @param {{width: number, height: number}} size The region to be copied.
     * @return {void}
     */
    static copyPixels(dstImage, dstPosition, srcImage, srcPosition, size) {
        let y, dstY, srcY, x, dstX, srcX, dstIndex, srcIndex;

        // Fix the problem when src image was out of dst image and pixels was copied to wrong position in dst image.
        const maxHeight = dstPosition.y + size.height <= dstImage.height ? size.height : dstImage.height - dstPosition.y;
        const maxWidth = dstPosition.x + size.width <= dstImage.width ? size.width : dstImage.width - dstPosition.x;
        for (y = 0; y < maxHeight; ++y) {
            dstY = dstPosition.y + y;
            srcY = srcPosition.y + y;

            for (x = 0; x < maxWidth; ++x) {
                dstX = dstPosition.x + x;
                srcX = srcPosition.x + x;

                // Since each pixel is composed of 4 values (RGBA) we multiply each index by 4.
                dstIndex = (dstY * dstImage.width + dstX) << 2;
                srcIndex = (srcY * srcImage.width + srcX) << 2;

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
        // noinspection OverlyComplexBooleanExpressionJS, MagicNumberJS
        if (imageBuffer[12] === 0x49 && imageBuffer[13] === 0x48 && imageBuffer[14] === 0x44 && imageBuffer[15] === 0x52) {
            // noinspection OverlyComplexArithmeticExpressionJS, MagicNumberJS
            const width = (imageBuffer[16] * 256 * 256 * 256) + (imageBuffer[17] * 256 * 256) + (imageBuffer[18] * 256) + imageBuffer[19];
            // noinspection OverlyComplexArithmeticExpressionJS, MagicNumberJS
            const height = (imageBuffer[20] * 256 * 256 * 256) + (imageBuffer[21] * 256 * 256) + (imageBuffer[22] * 256) + imageBuffer[23];
            return {width, height};
        }

        throw new TypeError("Buffer contains unsupported image type.");
    }

    /**
     *
     * @param {Buffer} imageBuffer
     * @param {String} filename
     * @param {PromiseFactory} promiseFactory
     * @return {Promise}
     */
    static saveImage(imageBuffer, filename, promiseFactory) {
        return promiseFactory.makePromise((resolve, reject) => {
            fs.writeFile(filename, imageBuffer, err => {
                if (err) {
                    return reject(err);
                }
                return resolve();
            });
        });
    }

    /**
     *
     * @param {String} path
     * @param {PromiseFactory} promiseFactory
     * @return {Promise.<Buffer>}
     */
    static readImage(path, promiseFactory) {
        return promiseFactory.makePromise((resolve, reject) => {
            fs.readFile(path, (err, data) => {
                if (err) {
                    return reject(err);
                }
                return resolve(data);
            });
        });
    }
}

module.exports = ImageUtils;
