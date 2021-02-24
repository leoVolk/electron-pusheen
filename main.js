const path = require("path");
const { app, BrowserWindow, Tray, Menu, ipcMain } = require("electron");
const { electron } = require("process");
const { ipcRenderer } = require("electron");

var { applicationSettings } = path.join(
  __dirname,
  "/src/store/defaultApplicationSettings.js"
);

const storage = require("electron-json-storage");

const {
  createBrowserWindow,
  createSettingsWindow,
} = require("./src/scripts/utils");

try {
  require("electron-reloader")(module);
} catch (_) {}

let tray = null;
let mainWindow = null;
let factsPusheenWindow = null;
let settingsWindow = null;

function init() {
  storage.get("applicationSettings", function (error, data) {
    if (error) throw error;

    if (Object.getOwnPropertyNames(data).length === 0) {
      storage.set("applicationSettings", applicationSettings, function (error) {
        if (error) throw error;
      });
    } else {
      applicationSettings = data;
    }

    tray = new Tray(path.join(__dirname, "/src/assets/logo.png"));

    assignWindowDefaults();

    initTray();
  });
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
    {
      label: "Settings",
      type: "checkbox",
      checked: settingsWindow.isVisible(),
      click: function () {
        handleWindowVisibility(settingsWindow, "./src/views/settings.html");
      },
    },
    { type: "separator" },
    {
      label: "Restart",
      click: function () {
        relaunchApp();
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

function relaunchApp() {
  app.relaunch();
  app.exit();
}

//there has to be a better way than this...
function assignWindowDefaults() {
  mainWindow = createBrowserWindow(
    applicationSettings.windowWidth,
    applicationSettings.windowHeight
  );
  factsPusheenWindow = createBrowserWindow(
    applicationSettings.windowWidth,
    applicationSettings.windowHeight
  );
  settingsWindow = createSettingsWindow();

  factsPusheenWindow.hide();

  mainWindow.loadFile("index.html");
  factsPusheenWindow.loadFile("./src/views/factsPusheen.html");
  settingsWindow.loadFile("./src/views/settings.html");

  //preventClosing(settingsWindow);
}

function preventClosing(w) {
  w.on("close", function (event) {
    if (!app.isQuiting) {
      event.preventDefault();
      w.hide();
    }

    return true;
  });
}
