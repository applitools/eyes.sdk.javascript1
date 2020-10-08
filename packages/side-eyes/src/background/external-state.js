import browser from 'webextension-polyfill'
import Modes from '../commons/modes'
import { getAccountInfo, verifyStoredAPIKey } from '../commons/api'

let state = {
  normalMode: Modes.NORMAL,
  mode: Modes.NORMAL,
}
let verificationMode = Modes.NORMAL

export function getExternalState() {
  return state
}

export function setExternalState(newState) {
  browser.runtime
    .sendMessage({
      state: setExternalStateInternally(newState),
    })
    .catch(() => {})
}

export function setExternalStateInternally(newState) {
  return Object.assign(state, newState, {
    mode: calculateMode(newState),
  })
}

function calculateMode(newState) {
  if (verificationMode !== Modes.NORMAL) {
    // if we are still in a setup stage dont let the mode change
    return verificationMode
  } else if (newState.normalMode && newState.mode) {
    // if both normal mode and mode are defined use mode
    return newState.mode
  } else if (newState.normalMode) {
    // if only normal mode is defined take it if the current mode is normal
    if (state.mode === Modes.NORMAL) {
      return newState.normalMode
    } else {
      return state.mode
    }
  } else {
    // if only mode is defined take it
    // if none is defined use the previous one
    // else use NORMAL
    return newState.mode ? newState.mode : state.mode ? state.mode : Modes.NORMAL
  }
}

export function validateOptions() {
  return verifyStoredAPIKey()
    .then(() => (verificationMode = Modes.NORMAL))
    .then(() => getAccountInfo())
    .catch(e => {
      if (e.message === "API key can't be empty") {
        return (verificationMode = Modes.SETUP)
      }
      return (verificationMode = Modes.INVALID)
    })
}

export function resetMode() {
  setExternalState({
    mode:
      verificationMode !== Modes.NORMAL ? verificationMode : state.isConnected ? state.normalMode : Modes.DISCONNECTED,
  })
}
