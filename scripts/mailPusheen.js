const { ipcRenderer } = require("electron");
ipcRenderer.send("openMailWindow");