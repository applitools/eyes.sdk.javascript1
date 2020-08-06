import { getDomSnapshot } from '../../dom-capture'

export async function getSnapshot(tabId) {
  const snapshot = await getDomSnapshot(tabId)
  removeCrossOriginIframes(snapshot)
  snapshot.resourceContents = mapResourceContents(snapshot)
  mapFrameResourceContents(snapshot.frames)

  return snapshot
}

function mapFrameResourceContents(frames) {
  frames.forEach(frame => {
    frame.resourceContents = mapResourceContents(frame)
    mapFrameResourceContents(frame.frames)
  })
}

function mapResourceContents(snapshot) {
  return snapshot.blobs.map(r => ({
    ...r,
    value: r.value ? Buffer.from(r.value) : undefined,
  }))
}

function removeCrossOriginIframes({ url, cdt, frames }) {
  const frameUrls = new Set(frames.map(frame => frame.url))
  cdt.map(node => {
    if (node.nodeName === 'IFRAME') {
      const srcAttr = node.attributes.find(attr => attr.name === 'src')
      const absoluteSrcAttr = srcAttr && new URL(srcAttr.value, url).href
      if (absoluteSrcAttr && !frameUrls.has(absoluteSrcAttr)) {
        srcAttr.value = ''
      }
    }
    return node
  })

  frames.forEach(removeCrossOriginIframes)

  return cdt
}
