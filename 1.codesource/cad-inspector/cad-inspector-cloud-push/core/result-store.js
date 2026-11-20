const DB = 'cad-inspector-results'
const STORE = 'results'

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB, 1)
    request.onupgradeneeded = () => request.result.createObjectStore(STORE)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function transact(mode, action) {
  const db = await openDb()
  try {
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, mode)
      const request = action(tx.objectStore(STORE))
      tx.oncomplete = () => resolve(request.result)
      tx.onerror = () => reject(tx.error)
      tx.onabort = () => reject(tx.error)
    })
  } finally { db.close() }
}

export const loadResult = () => transact('readonly', store => store.get('latest'))
export async function saveResult(result) {
  const db = await openDb()
  try {
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite'), store = tx.objectStore(STORE)
      store.put(result, 'latest')
      store.put({ ...result, savedAt: Date.now() }, `history:${Date.now()}:${crypto.randomUUID()}`)
      tx.oncomplete = resolve
      tx.onerror = () => reject(tx.error)
      tx.onabort = () => reject(tx.error)
    })
  } finally { db.close() }
}
export async function listResults() {
  const db = await openDb()
  try {
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readonly'), items = []
      const req = tx.objectStore(STORE).openCursor()
      req.onsuccess = () => { const cursor = req.result; if (!cursor) return; if (String(cursor.key).startsWith('history:')) items.push({ id: cursor.key, ...cursor.value }); cursor.continue() }
      tx.oncomplete = () => resolve(items.sort((a, b) => b.savedAt - a.savedAt))
      tx.onerror = () => reject(tx.error)
      tx.onabort = () => reject(tx.error)
    })
  } finally { db.close() }
}
export const deleteResult = () => transact('readwrite', store => store.delete('latest'))
