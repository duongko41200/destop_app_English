"use strict";
const electron = require("electron");
if (!process.contextIsolated) {
  throw new Error("contextIsolation must be enabled in the BrowserWindow");
}
try {
  electron.contextBridge.exposeInMainWorld("context", {
    locale: navigator.language,
    getNotes: (...args) => electron.ipcRenderer.invoke("getNotes", ...args),
    readNote: (...args) => electron.ipcRenderer.invoke("readNote", ...args),
    writeNote: (...args) => electron.ipcRenderer.invoke("writeNote", ...args),
    createNote: (...args) => electron.ipcRenderer.invoke("createNote", ...args),
    deleteNote: (...args) => electron.ipcRenderer.invoke("deleteNote", ...args)
  });
} catch (error) {
  console.error(error);
}
