const { contextBridge, ipcRenderer } = require('electron')

// Custom APIs for renderer
const renderer_api = {
  GetAllData: () => ipcRenderer.invoke('data:GET_ALL_DATA')
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('renderer_api', renderer_api)
  } catch (error) {
    console.error(error)
  }
} 
