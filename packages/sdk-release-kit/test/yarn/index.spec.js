const {expect} = require('chai')
const {findUnfixedDeps, findUpgradedDeps} = require('../../src/yarn')

describe('findUnfixedDeps', () => {
  it('returns unfixed deps', () => {
    expect(
      findUnfixedDeps({
        pkg1: '1.2.3',
      }),
    ).to.eql({})

    expect(
      findUnfixedDeps({
        pkg1: '1.2.3',
        pkg2: '^1.2.3',
      }),
    ).to.eql({pkg2: '^1.2.3'})

    expect(
      findUnfixedDeps({
        pkg1: '1.2.3',
        pkg2: '^1.2.3',
        pkg3: '1.2.3',
        pkg4: '~1.2.3',
      }),
    ).to.eql({pkg2: '^1.2.3', pkg4: '~1.2.3'})
  })
})

describe('findUpgradedDeps', () => {
  it('returns packages which differ in version between old and new', () => {
    expect(findUpgradedDeps({pkg1: 'x'}, {pkg2: 'y'})).to.eql([])
    expect(findUpgradedDeps({pkg2: 'x'}, {pkg1: 'y'})).to.eql([])
    expect(findUpgradedDeps({pkg1: 'x'}, {pkg1: 'y'})).to.eql([['pkg1', 'x', 'y']])
    expect(
      findUpgradedDeps(
        {pkg1: 'x', pkg2: 'y', pkg3: 'z', pkg5: 'w'},
        {pkg1: '1', pkg2: 'y', pkg3: '3', pkg4: '4'},
      ),
    ).to.eql([
      ['pkg1', 'x', '1'],
      ['pkg3', 'z', '3'],
    ])
  })
})
