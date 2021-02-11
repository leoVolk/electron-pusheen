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
let weatherWindow = null;
let timeWindow = null;
let mailWindow = null;
let settingsWindow = null;
let mailListener;

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
      label: "Time",
      type: "checkbox",
      checked: false,
      click: function () {
        if (!timeWindow) {
          weatherWindow = createBrowserWindow(256, 128);
          weatherWindow.loadFile("./src/views/weather.html");
        } else if (timeWindow.isVisible()) {
          timeWindow.hide();
        } else {
          timeWindow.show();
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
  mainWindow.loadFile("./src/views/random.html");
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
    focusable: true,
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

//listens on the mail window close button to hide the mail window
ipcMain.on("hideMailWindow", function () {
  mailWindow.hide();
});

// listens on the settings window if the mail settings have been updated and restarts the mail listener
ipcMain.on("updatedMailer", function () {
  if (mailListener) {
    mailListener.stop();
    initMailer();
  } else {
    initMailer();
  }
});

// TODO: error handling
function initMailer() {
  storage.get("emailSettings", function (error, data) {
    if (error) throw error;
    mailListener = new MailListener({
      username: data.email,
      password: data.password,
      host: data.host,
      port: data.port, // imap port
      tls: true,
      connTimeout: 10000, // Default by node-imap
      authTimeout: 5000, // Default by node-imap,
      debug: console.log, // Or your custom function with only one incoming argument. Default: null
      tlsOptions: { rejectUnauthorized: false },
      mailbox: "INBOX", // mailbox to monitor
      searchFilter: ["UNSEEN"], // the search filter being used after an IDLE notification has been retrieved
      markSeen: true, // all fetched email willbe marked as seen and not fetched next time
      fetchUnreadOnStart: true, // use it only if you want to get all unread email on lib start. Default is `false`,
      attachments: false, // download attachments as they are encountered to the project directory
      attachmentOptions: { directory: "attachments/" }, // specify a download directory for attachments
    });
    mailListener.start();

    // start listening

    // stop listening
    //mailListener.stop();

    mailListener.on("server:connected", function () {
      console.log("imapConnected");
    });

    mailListener.on("mailbox", function (mailbox) {
      console.log("Total number of mails: ", mailbox.messages.total); // this field in mailbox gives the total number of emails
    });

    mailListener.on("server:disconnected", function () {
      console.log("imapDisconnected");
    });

    mailListener.on("error", function (err) {
      console.log(err);
    });

    mailListener.on("headers", function (headers, seqno) {
      // do something with mail headers
    });

    mailListener.on("body", function (body, seqno) {
      // do something with mail body
    });

    mailListener.on("attachment", function (attachment, path, seqno) {
      // do something with attachment
    });

    mailListener.on("mail", function (mail, seqno) {
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
      // do something with the whole email as a single object
    });
  });
}
