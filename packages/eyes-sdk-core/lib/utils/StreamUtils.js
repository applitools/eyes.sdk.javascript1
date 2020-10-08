'use strict'
const Stream = require('stream')

class ReadableBufferStream extends Stream.Readable {
  /**
   * @param {Buffer} buffer - The buffer to be used as the stream's source.
   * @param {object} [options] - An "options" object to be passed to the stream constructor.
   */
  constructor(buffer, options) {
    super(options)
    this._buffer = buffer
  }

  /**
   * Override of the _read function, as required when implementing a stream.
   * @private
   */
  _read() {
    this.push(this._buffer)
    this.push(null)
  }
}

class WritableBufferStream extends Stream.Writable {
  /**
   * @param {object} [options] - An "options" object to be passed to the stream constructor.
   * @return {WritableBufferStream}
   */
  constructor(options) {
    super(options)
    this._buffer = Buffer.alloc(0)
  }

  /**
   * Override of the _write function, as require when implementing a Writable stream.
   * @param {Buffer|string} chunk - The chunk to write to the stream.
   * @param {string} enc - If {@code chunk} is a string, this is the encoding of {@code chunk}.
   * @param {function} next - The callback to call when finished handling {@code chunk}.
   * @private
   */
  _write(chunk, enc, next) {
    // Since chunk could be either a Buffer or a string.
    const chunkAsBuffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, enc)
    this._buffer = Buffer.concat([this._buffer, chunkAsBuffer])
    next()
  }

  /**
   * @return {boolean} {@code false} if the stream wishes for the calling code to wait for the 'drain' event to be
   *   emitted before continuing to write additional data, otherwise {@code true}.
   */
  writeInt(value) {
    const buf = Buffer.alloc(4)
    buf.writeInt32BE(value, 0)
    return this.write(buf)
  }

  /**
   * @return {boolean} {@code false} if the stream wishes for the calling code to wait for the 'drain' event to be
   *   emitted before continuing to write additional data, otherwise {@code true}.
   */
  writeShort(value) {
    const buf = Buffer.alloc(2)
    buf.writeInt16BE(value, 0)
    return this.write(buf)
  }

  /**
   * @return {boolean} {@code false} if the stream wishes for the calling code to wait for the 'drain' event to be
   *   emitted before continuing to write additional data, otherwise {@code true}.
   */
  writeByte(value) {
    const buf = Buffer.alloc(1)
    buf.writeInt8(value, 0)
    return this.write(buf)
  }

  /**
   * @return {Buffer} - The buffer which contains the chunks written up to this point.
   */
  getBuffer() {
    return this._buffer
  }

  /**
   * Resets the buffer which contains the chunks written so far.
   * @return {Buffer} - The buffer which contains the chunks written up to the reset.
   */
  resetBuffer() {
    const buffer = this._buffer
    this._buffer = Buffer.alloc(0)
    return buffer
  }
}

/**
 * @type {{ReadableBufferStream: ?, WritableBufferStream: ?}}
 */
module.exports = {
  ReadableBufferStream,
  WritableBufferStream,
}
