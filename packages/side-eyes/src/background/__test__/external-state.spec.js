import { getExternalState, setExternalState, setExternalStateInternally, resetMode } from '../external-state'
jest.mock('webextension-polyfill')

describe('external-state', () => {
  it('defaults to normal mode', () => {
    expect(getExternalState()).toMatchObject({ mode: 'normal' })
  })

  it('can change the state', () => {
    setExternalState({ mode: 'recording' })
    expect(getExternalState()).toMatchObject({ mode: 'recording' })
  })

  it('resets to normal mode', () => {
    setExternalStateInternally({ isConnected: true })
    resetMode()
    expect(getExternalState()).toMatchObject({ mode: 'normal' })
  })

  it('diconnection resets normal mode to normal', () => {
    setExternalState({ mode: 'disconnected', normalMode: 'normal' })
    expect(getExternalState()).toMatchObject({
      mode: 'disconnected',
      normalMode: 'normal',
    })
  })
})
