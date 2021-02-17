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
let factsPusheenWindow = null;

function init() {
  createMainWindow();
}

function createMainWindow() {
  tray = new Tray(path.join(__dirname, "/src/assets/logo.png"));

  mainWindow = createBrowserWindow(400, 200);
  factsPusheenWindow = createBrowserWindow(400, 300);

  initTray();

  mainWindow.loadFile("index.html");
  factsPusheenWindow.loadFile("./src/views/factsPusheen.html");
}

if (process.platform === "darwin") {
  app.dock.hide();
}

function initTray() {
  const contextMenu = Menu.buildFromTemplate([
    { label: "pusheen" },
    { type: "separator" },
    {
      label: "Default",
      type: "checkbox",
      checked: mainWindow.isVisible(),
      click: function () {
        handleWindowVisibility(mainWindow, "index.html");
      },
    },
    {
      label: "Facts",
      type: "checkbox",
      checked: factsPusheenWindow.isVisible(),
      click: function () {
        handleWindowVisibility(
          factsPusheenWindow,
          "./src/views/factsPusheen.html"
        );
      },
    },
    { type: "separator" },
    /*     {
      label: "Settings",
      type: "checkbox",
      checked: mainWindow.isVisible(),
      click: function () {
        handleWindowVisibility(mainWindow, "");
      },
    }, */
    {
      label: "Quit",
      click: function () {
        app.quit();
      },
    },
  ]);
  tray.setToolTip("Pusheen!");
  tray.setContextMenu(contextMenu);
}

app.whenReady().then(() => {
  init();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) init();
  });
});

app.setLoginItemSettings({
  openAtLogin: true,
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

function handleWindowVisibility(w, fallbackView) {
  if (w) {
    if (w.isVisible()) {
      w.hide();
    } else {
      w.show();
    }
  } else {
    w = createBrowserWindow(400, 200);
    w.loadFile(fallbackView);
  }
}
