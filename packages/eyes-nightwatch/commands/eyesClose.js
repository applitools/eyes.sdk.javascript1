module.exports = class EyesClose {
  async command(args) {
    await this.client.api.globals.__eyes.close(args)
  }
}
