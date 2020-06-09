const RESET_STYLES = `
  body{position: relative; margin: 0; padding: 0;}
`

function generatePositionStyle(rect) {
  return `position:absolute;left:${rect.x}px;top:${rect.y}px;width:${rect.width}px;height:${rect.height}px`
}

function elementToCdt(element) {
  const cdt = {
    nodeType: 1,
    nodeName: 'DIV',
    attributes: [{name: 'data-fake-selector', value: element.selector}],
    childNodeIndexes: [],
  }
  if (element.rect) {
    cdt.attributes.push({name: 'style', value: generatePositionStyle(element.rect)})
  }
  return cdt
}

function generateDomSnapshot(driver) {
  const cdt = Array.from(driver._elements.values()).reduce((cdt, elements) => {
    return cdt.concat(elements.map(elementToCdt))
  }, [])
  return JSON.stringify({
    status: 'SUCCESS',
    value: {
      cdt: [
        {nodeType: 9, childNodeIndexes: [cdt.length + 5]},
        {nodeType: 3, nodeValue: RESET_STYLES},
        {nodeType: 1, nodeName: 'STYLE', attributes: [], childNodeIndexes: [1]},
        {nodeType: 1, nodeName: 'HEAD', attributes: [], childNodeIndexes: [2]},
        ...cdt,
        {
          nodeType: 1,
          nodeName: 'BODY',
          attributes: [],
          childNodeIndexes: cdt.map((_, index) => index + 4),
        },
        {
          nodeType: 1,
          nodeName: 'HTML',
          attributes: [],
          childNodeIndexes: [3, cdt.length + 4],
        },
      ],
      url: driver._window.url,
      srcAttr: null,
      resourceUrls: [],
      blobs: [],
      frames: [],
      scriptVersion: '3.5.0',
    },
    error: null,
  })
}

exports.generateDomSnapshot = generateDomSnapshot
