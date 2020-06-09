import { isEyesCommand, containsEyesCommands } from '../../commons/commands'

describe('Commands', () => {
  describe('isEyesCommand', () => {
    it('should find a valid eyes command', () => {
      expect(isEyesCommand({ command: 'eyesCheckWindow' })).toBeTruthy()
    })
    it('should not find an invalid eyes command', () => {
      expect(isEyesCommand({ command: 'open' })).toBeFalsy()
    })
  })
  describe('containsEyesCommands', () => {
    it('should determine if a group of commands contains one or more valid eyes command', () => {
      const commands = [
        { command: 'open' },
        { command: 'eyesSetViewportSize' },
        { command: 'eyesSetBaselineEnvName' },
        { command: 'click' },
        { command: 'eyesCheckWindow' },
      ]
      expect(containsEyesCommands(commands)).toBeTruthy()
    })
    it('should determine if a group of commands does not contain a valid eyes command, exclusing set viewport size', () => {
      // set viewport size is ignored
      expect(
        containsEyesCommands([{ command: 'open' }, { command: 'eyesSetViewportSize' }], ['eyesSetViewportSize'])
      ).toBeFalsy()
      expect(containsEyesCommands(undefined)).toBeFalsy()
    })
  })
})
