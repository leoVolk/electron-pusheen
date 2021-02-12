// TODO: Export for better reading
// Modules to control application life and create native browser window
const { app, BrowserWindow, Tray, Menu, ipcMain } = require("electron");
const { ipcRenderer } = require("electron");
var { MailListener } = require("mail-listener5");
const storage = require("electron-json-storage");

const path = require("path");
const isDev = require("electron-is-dev");
const { electron } = require("process");

try {
  require("electron-reloader")(module);
} catch (_) {}

let tray = null;
let mainWindow = null;
function createMainWindow() {
  tray = new Tray(path.join(__dirname, "/src/assets/logo.png"));
  const contextMenu = Menu.buildFromTemplate([
    { label: "pusheen" },
    { type: "separator" },
    {
      label: "Default",
      type: "checkbox",
      checked: true,
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
        mainWindow.destroy();
        app.quit();
      },
    },
  ]);
  tray.setToolTip("Pusheen!");
  tray.setContextMenu(contextMenu);

  // Create the browser window.
  mainWindow = createBrowserWindow(400, 200);
  // and load the index.html of the app.
  mainWindow.loadFile("index.html");
}
if (process.platform === "darwin") {
  app.dock.hide();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createMainWindow();
  //initMailer();
  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.setLoginItemSettings({
  openAtLogin: true,
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// creates the default browser window for pusheen
function createBrowserWindow(w, h, x = 0, y = 0) {
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
    resizable: true,
    alwaysOnTop: true,
    focusable: false,
    skipTaskbar: true,
    title: "Pusheen",
    hasShadow: false,
    backgroundColor: "#00000000",
    icon: path.join(__dirname, "/src/assets/logo.icns"),
  });
  if (isDev) {
    window.webContents.openDevTools({ mode: "detach" });
  }

  return window;
}
