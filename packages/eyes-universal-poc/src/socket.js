const WebSocket = require('ws')
const uuid = require('uuid')
const chalk = require('chalk')

function makeSocket(ws) {
  let socket = null
  const listeners = new Map()
  const queue = new Set()

  attach(ws)

  function attach(ws) {
    if (!ws) return

    if (ws.readyState === WebSocket.CONNECTING) ws.on('open', () => attach(ws))
    else if (ws.readyState === WebSocket.OPEN) {
      socket = ws
      queue.forEach(command => command())
      queue.clear()

      socket.on('message', message => {
        const {name, key, payload} = deserialize(message)
        const fns = listeners.get(name)
        if (fns) fns.forEach(fn => fn(payload, key))
        if (key) {
          const fns = listeners.get(`${name}/${key}`)
          if (fns) fns.forEach(fn => fn(payload, key))
        }
      })
      socket.on('close', () => {
        const fns = listeners.get('close')
        if (fns) fns.forEach(fn => fn())
      })
    }
  }

  function connect(url) {
    const ws = new WebSocket(url)
    attach(ws)
  }

  function disconnect() {
    if (!socket) return
    socket.terminate()
    socket = null
  }

  function request(name, payload) {
    return new Promise((resolve, reject) => {
      const key = uuid.v4()
      console.log(`${chalk.blue('[REQUEST]')} ${name}, ${key}, ${JSON.stringify(payload, null, 2)}`)
      emit({name, key}, payload)
      once({name, key}, response => {
        if (response.error) return reject(response.error)
        return resolve(response.result)
      })
    })
  }

  function command(name, fn) {
    on(name, async (payload, key) => {
      try {
        console.log(
          `${chalk.yellow('[COMMAND]')} ${name}, ${key}, ${JSON.stringify(payload, null, 2)}`,
        )
        const result = await fn(payload)
        emit({name, key}, {result})
      } catch (error) {
        emit({name, key}, {error})
      }
    })
  }

  function subscribe(name, publisher, fn) {
    const subscription = uuid.v4()
    emit(name, {publisher, subscription})
    const off = on({name, key: subscription}, fn)
    return () => (emit({name, key: subscription}), off())
  }

  function on(type, fn) {
    const name = typeof type === 'string' ? type : `${type.name}/${type.key}`
    let fns = listeners.get(name)
    if (!fns) {
      fns = new Set()
      listeners.set(name, fns)
    }
    fns.add(fn)
    return () => off(name, fn)
  }

  function once(type, fn) {
    const off = on(type, (...args) => (fn(...args), off()))
    return off
  }

  function off(name, fn) {
    if (!fn) return listeners.delete(name)
    const fns = listeners.get(name)
    if (!fns) return false
    const existed = fns.delete(fn)
    if (!fns.size) listeners.delete(name)
    return existed
  }

  function emit(type, payload) {
    const command = () => socket.send(serialize(type, payload))
    if (socket) command()
    else queue.add(command)
    return () => queue.delete(command)
  }

  function ref() {
    const command = () => socket._socket.ref()
    if (socket) command()
    else queue.add(command)
    return () => queue.delete(command)
  }

  function unref() {
    const command = () => socket._socket.unref()
    if (socket) command()
    else queue.add(command)
    return () => queue.delete(command)
  }

  return {
    on,
    once,
    off,
    emit,
    request,
    command,
    subscribe,
    connect,
    disconnect,
    ref,
    unref,
  }
}

function serialize(type, payload) {
  const message =
    typeof type === 'string' ? {name: type, payload} : {name: type.name, key: type.key, payload}
  return JSON.stringify(message)
}

function deserialize(message) {
  return JSON.parse(message)
}

module.exports = makeSocket
