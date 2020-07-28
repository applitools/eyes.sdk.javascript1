function makeMochaTestTemplate(emittedTest) {
  return `${emittedTest.hooks.deps.join('\n')}

describe${emittedTest.disabled ? '.skip' : ''}('Coverage Tests', () => {
  ${emittedTest.hooks.vars.join('\n  ')}
  beforeEach(async () => {
    ${emittedTest.hooks.beforeEach.join('\n    ')}
  })
  afterEach(async () => {
    ${emittedTest.hooks.afterEach.join('\n    ')}
  })
  it('${emittedTest.name}', async () => {
    ${emittedTest.commands.join('\n    ')}
  })
})`
}

module.exports = makeMochaTestTemplate
