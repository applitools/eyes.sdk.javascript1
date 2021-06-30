module.exports = class EyesCheck {
  async command(args) {
    await this.client.api.globals.__eyes.check(args)
  }
}
