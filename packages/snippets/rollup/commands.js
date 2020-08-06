const rollup = require('rollup')
const glob = require('glob')
const path = require('path')
const fs = require('fs')
const commonjs = require('@rollup/plugin-commonjs')
const {babel} = require('@rollup/plugin-babel')
const {terser} = require('rollup-plugin-terser')
const progress = require('./progress')

function configure() {
  const input = glob.sync('./src/browser/*.js')
  return {
    input,
    output: {
      json: './dist/commands.json',
      snippet: './dist/index.js',
    },
    plugins: [
      commonjs(),
      babel({
        babelHelpers: 'inline',
        presets: [['@babel/preset-env', {loose: true, modules: false, targets: {ie: '10'}}]],
      }),
      terser(),
      progress({total: input.length}),
    ],
  }
}

const generator = {
  async json(bundle) {
    const generated = await bundle.generate({name: 's', format: 'iife'})
    for (const output of generated.output) {
      output.code = `function(arg){${output.code}return s(arg)}`
    }
    return generated.output
  },
  async snippet(bundle) {
    const generated = await bundle.generate({name: 's', format: 'iife'})
    for (const output of generated.output) {
      output.code = `exports.${output.name}=function(arg){\n${output.code}return s(arg)\n}`
    }
    return generated.output
  },
}

const concat = {
  json(outputs) {
    const json = outputs.reduce(
      (json, output) => Object.assign(json, {[output.name]: output.code}),
      {},
    )
    return JSON.stringify(json, null, 2)
  },
  snippet(outputs) {
    return outputs.map(output => output.code).join('\n')
  },
}

async function bundle({formats}) {
  const config = configure()
  const outputs = {json: [], snippet: []}

  for (const input of config.input) {
    const bundle = await rollup.rollup({
      input,
      plugins: config.plugins,
    })
    for (const format of formats) {
      const output = await generator[format](bundle)
      outputs[format].push(...output)
    }
  }

  for (const [format, output] of Object.entries(outputs)) {
    if (output.length > 0) {
      fs.writeFileSync(path.resolve(process.cwd(), config.output[format]), concat[format](output))
    }
  }
}

async function watch({formats}) {
  await bundle({formats})
  const {input} = configure()
  const watcher = rollup.watch({
    input,
    watch: {
      buildDelay: 1000,
    },
  })
  watcher.on('change', () => bundle({formats}))
}

exports.bundle = bundle
exports.watch = watch
