function parseType(type) {
  const match = type.match(/(?<name>[A-Za-z][A-Za-z0-9_]*)(<(?<generic>.*?)>)?/)
  if (!match) {
    throw new Error(
      'Type format is incorrect. Please follow the convention (e.g. TypeName or Type1<Type2, Type3>)',
    )
  }
  return {
    name: match.groups.name,
    generic: match.groups.generic ? match.groups.generic.split(/, ?/).map(parseType) : null,
  }
}

module.exports = function() {
  const o = {}
  const syntax = new Proxy(o, {
    get(target, key) {
      if (key in target) return Reflect.get(target, key)
      throw new Error(
        `EmitTracker don't have an implementation for "${key}" syntax. Use ".addSyntax('${key}', <impl>)" method to add an implementation`,
      )
    },
  })
  const hooks = {deps: [], vars: [], beforeEach: [], afterEach: []}
  const commands = []

  return {
    addSyntax,
    withScope,
    addCommand,
    storeCommand: addCommand,
    addHook,
    storeHook: addHook,
    getOutput,
  }

  function withScope(logic, scope = []) {
    return () => logic(...scope.map(name => useRef(name)))
  }

  function useRef(deref) {
    const ref = function() {}
    ref.isRef = true
    ref.ref = function(name) {
      if (name) {
        ref._name = name
        return this
      } else if (ref._isResolved) {
        return ref._name
      } else {
        ref._name = typeof deref === 'function' ? deref({type: ref._type, name: ref._name}) : deref
        ref._isResolved = true
        return ref._name
      }
    }
    ref.type = function(type) {
      if (type) {
        ref._type = parseType(type)
        return this
      } else {
        return ref._type
      }
    }
    return new Proxy(ref, {
      get(ref, key) {
        if (key in ref) return Reflect.get(ref, key)
        return useRef(() => syntax.getter({type: ref.type(), target: ref.ref(), key}))
      },
      apply(ref, _, args) {
        return useRef(() => syntax.call({target: ref.ref(), args: Array.from(args)}))
      },
    })
  }

  function addSyntax(name, callback) {
    syntax[name] = callback
  }

  function addCommand(command) {
    if (Array.isArray(command)) {
      const [result] = command.map(command => {
        if (typeof command === 'function') {
          const result = command()
          if (result.isRef) {
            addCommand(syntax.return({value: result.ref(), type: result.type()}))
          }
        } else {
          return addCommand(command)
        }
      })
      return result
    }
    const id = commands.push(typeof command === 'function' ? command() : command)
    return useRef(({name = `var_${id}`, type} = {}) => {
      const value = commands[id - 1]
      commands[id - 1] = syntax.var({name, value, type})
      return name
    })
  }

  function addHook(name, value) {
    switch (name) {
      case 'deps':
      case 'vars':
      case 'beforeEach':
      case 'afterEach':
        return hooks[name].push(value)
      default:
        throw new Error(
          `Unsupported hook ${name}. Please specify one of either ${Object.keys(hooks).join(', ')}`,
        )
    }
  }

  function getOutput() {
    return {hooks, commands}
  }
}
