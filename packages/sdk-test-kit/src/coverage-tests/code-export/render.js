function createJestTestFileString(emittedTest) {
  return `// Generated by sdk-test-kit
${emittedTest.hooks.deps.join('\n')}

describe('Coverage Tests', () => {
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

function createTestFileString(emittedTest, testFrameworkTemplate = createJestTestFileString) {
  return testFrameworkTemplate(emittedTest)
}

module.exports = {
  createTestFileString,
}
