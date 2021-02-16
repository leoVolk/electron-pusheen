const { BrowserWindow } = require("electron");
const isDev = require("electron-is-dev");
const path = require("path");

module.exports = {
  createBrowserWindow: function (w, h, x = 0, y = 0) {
    let window = new BrowserWindow({
      width: w,
      height: h,
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
      },
      x: x,
      y: y,
      frame: false,
      transparent: true,
      resizable: false,
      alwaysOnTop: true,
      focusable: false,
      skipTaskbar: true,
      title: "Pusheen",
      maximizable: false,
      hasShadow: false,
      backgroundColor: "#00000000",
      icon: path.join(__dirname, "/src/assets/logo.icns"),
    });

    if (isDev) {
      window.webContents.openDevTools({ mode: "detach" });
    }

    return window;
  },
  createSettingsWindow: function () {},
};