function makeMochaTestTemplate(test) {
  const tags = []
  if (test.meta.features) tags.push(...test.meta.features.map(feature => `@${feature}`))
  if (test.meta.native) tags.push('@native')
  if (test.meta.mobile) tags.push('@mobile')
  if (test.meta.browser) {
    tags.push(`@${test.meta.browser.replace(/-[\d.]+$/, '')}`)
  }

  return `${test.hooks.deps.join('\n')}

describe${test.disabled ? '.skip' : ''}('Coverage Tests', () => {
  ${test.hooks.vars.join('\n  ')}
  beforeEach(async () => {
    ${test.hooks.beforeEach.join('\n    ')}
  })
  afterEach(async () => {
    ${test.hooks.afterEach.join('\n    ')}
  })
  it('${test.name}${tags.length > 0 ? ` (${tags.join(' ')})` : ''}', async () => {
    ${test.commands.join('\n    ')}
  })
})`
}

module.exports = makeMochaTestTemplate
