function makeMochaTestTemplate({name, skip, output, meta}) {
  const tags = []
  if (meta.features) tags.push(...meta.features.map(feature => `@${feature}`))
  if (meta.native) tags.push('@native')
  if (meta.mobile) tags.push('@mobile')
  if (meta.browser) {
    tags.push(`@${meta.browser.replace(/-[\d.]+$/, '')}`)
  }

  return `// ${name}
${output.hooks.deps.join('\n')}

describe${skip ? '.skip' : ''}('Coverage Tests', () => {
  ${output.hooks.vars.join('\n  ')}
  beforeEach(async () => {
    ${output.hooks.beforeEach.join('\n    ')}
  })
  afterEach(async () => {
    ${output.hooks.afterEach.join('\n    ')}
  })
  it('${name}${tags.length > 0 ? ` (${tags.join(' ')})` : ''}', async () => {
    ${output.commands.join('\n    ')}
  })
})`
}

module.exports = makeMochaTestTemplate
