const path = require("path");
const { app, BrowserWindow, Tray, Menu, ipcMain } = require("electron");
const { electron } = require("process");
const { ipcRenderer } = require("electron");
const storage = require("electron-json-storage");
const { createBrowserWindow } = require("./src/scripts/utils");

try {
  require("electron-reloader")(module);
} catch (_) {}

let tray = null;
let mainWindow = null;


function createMainWindow() {
  tray = new Tray(path.join(__dirname, "/src/assets/logo.png"));

  // Create the browser window.
  mainWindow = createBrowserWindow(400, 200);

  const contextMenu = Menu.buildFromTemplate([
    { label: "pusheen" },
    { type: "separator" },
    {
      label: "Default",
      type: "checkbox",
      checked: mainWindow.isVisible(),
      click: function () {
        if (mainWindow.isVisible()) {
          mainWindow.hide();
        } else {
          mainWindow.show();
        }
      },
    },
    { type: "separator" },
    {
      label: "Settings",
      type: "checkbox",
      checked: mainWindow.isVisible(),
      click: function () {
        if (mainWindow.isVisible()) {
          mainWindow.hide();
        } else {
          mainWindow.show();
        }
      },
    },
    {
      label: "Quit",
      click: function () {
        app.quit();
      },
    },
  ]);
  tray.setToolTip("Pusheen!");
  tray.setContextMenu(contextMenu);

  mainWindow.loadFile("index.html");
}

if (process.platform === "darwin") {
  app.dock.hide();
}

app.whenReady().then(() => {
  createMainWindow();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.setLoginItemSettings({
  openAtLogin: true,
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
