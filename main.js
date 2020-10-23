// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  Tray,
  Menu,
  screen,
  ipcMain,
  ipcRenderer,
} = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
const { electron } = require("process");

try {
  require("electron-reloader")(module);
} catch (_) {}

let tray = null;
let mainWindow = null;
let weatherWindow = null;
let mailWindow = null;
let settingsWindow = null;

function createMainWindow() {
  tray = new Tray(path.join(__dirname, "/src/assets/logo.png"));
  const contextMenu = Menu.buildFromTemplate([
    { label: "pusheen" },
    { type: "separator" },
    {
      label: "Time",
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
      label: "Weather",
      type: "checkbox",
      click: function () {
        if (!weatherWindow) {
          weatherWindow = createBrowserWindow(256, 128);
          weatherWindow.loadFile("./src/views/weather.html");
        } else {
          if (weatherWindow.isVisible()) {
            weatherWindow.hide();
          } else {
            weatherWindow.show();
          }
        }
      },
    },
    { type: "separator" },
    {
      label: "Settings",
      type: "checkbox",
      click: function () {
        if (!settingsWindow) {
          settingsWindow = createSettingsWindow();
          settingsWindow.loadFile("./src/views/settings.html");
        } else {
          if (settingsWindow.isVisible()) {
            settingsWindow.hide();
          } else {
            settingsWindow.show();
          }
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
  mainWindow = createBrowserWindow(256, 128);
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
    resizable: false,
    alwaysOnTop: true,
    focusable: true,
    title: "Pusheen",
    backgroundColor: "#00000000",
    icon: path.join(__dirname, "/src/assets/logo.icns"),
  });
  if (isDev) {
    window.webContents.openDevTools({ mode: "detach" });
  }

  return window;
}

// creates the settings window
function createSettingsWindow() {
  let window = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
    frame: true,
    transparent: false,
    resizable: true,
    focusable: true,
    title: "Settings - Electro Pusheen",
  });

  if (isDev) {
    window.webContents.openDevTools({ mode: "detach" });
  }

  return window;
}



//listens on the main window if the mail window should be opened
ipcMain.on("openMailWindow", function () {
  if (!mailWindow) {
    mailWindow = createBrowserWindow(256, 128);
    mailWindow.loadFile("./src/views/mail.html");
  } else {
    if (mailWindow.isVisible()) {
      mailWindow.hide();
    } else {
      mailWindow.show();
    }
  }
});

//listens on the mail window close button to hide the mail window
ipcMain.on("hideMailWindow", function () {
  mailWindow.hide();
});

// listens on the settings window if the mail settings have been updated and restarts the mail listener
ipcMain.on("updatedMailer", function () {
  mainWindow.webContents.send("updateMailer");
});
