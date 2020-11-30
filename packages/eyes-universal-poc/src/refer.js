const uuid = require('uuid')

const REF_ID = 'applitools-ref-id'

function makeRefer() {
  const store = new Map()
  const relation = new Map()

  return {isRef, ref, deref, destroy}

  function isRef(ref) {
    return Boolean(ref[REF_ID])
  }

  function ref(value, parentRef) {
    const ref = uuid.v4()
    store.set(ref, value)
    if (parentRef) {
      let childRefs = relation.get(parentRef[REF_ID])
      if (!childRefs) {
        childRefs = new Set()
        relation.set(parentRef[REF_ID], childRefs)
      }
      childRefs.add(ref)
    }
    return {[REF_ID]: ref}
  }

  function deref(ref) {
    if (isRef(ref)) {
      return store.get(ref[REF_ID])
    } else {
      return ref
    }
  }

  function destroy(ref) {
    if (!isRef(ref)) return
    const childRefs = relation.get(ref[REF_ID])
    childRefs.forEach(childRef => destroy(childRef))
    store.delete(ref[REF_ID])
  }
}

module.exports = makeRefer
