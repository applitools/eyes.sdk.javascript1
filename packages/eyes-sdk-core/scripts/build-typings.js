const ts = require('typescript')
const fs = require('fs')
const path = require('path')

function transformer() {
  function transform(context, file) {
    const className = path.basename(file.fileName, '.js')
    if (['EyesClassic', 'EyesVisualGrid'].includes(className)) {
      function visit(node, parentNodes = []) {
        if (node.kind === ts.SyntaxKind.ExpressionWithTypeArguments) {
          const classParentNode = parentNodes.find(
            node => node.kind === ts.SyntaxKind.ClassDeclaration,
          )
          if (classParentNode && classParentNode.typeParameters) {
            const typeAttributes = classParentNode.typeParameters.map(typeParameter =>
              ts.createTypeReferenceNode(typeParameter.name.escapedText),
            )
            return ts.updateExpressionWithTypeArguments(node, typeAttributes, node.expression)
          }
        }
        return ts.visitEachChild(node, child => visit(child, [node, ...parentNodes]), context)
      }
      return ts.visitEachChild(file, visit, context)
    }
    return file
  }
  return context => file => transform(context, file)
}

function compile(fileNames, options) {
  fs.rmdirSync(options.declarationDir, {recursive: true})
  const host = ts.createCompilerHost(options)

  const program = ts.createProgram(fileNames, options, host)
  const emitResult = program.emit(undefined, undefined, undefined, undefined, {
    afterDeclarations: [transformer()],
  })

  const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics)

  allDiagnostics.forEach(diagnostic => {
    if (diagnostic.file) {
      const {line, character} = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start)
      const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
      console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`)
    } else {
      console.log(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'))
    }
  })

  let exitCode = emitResult.emitSkipped ? 1 : 0
  process.exit(exitCode)
}

compile(['./index.js'], {
  allowJs: true,
  declaration: true,
  declarationDir: './typings',
  emitDeclarationOnly: true,
})
