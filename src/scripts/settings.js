const path = require("path");
const storage = require("electron-json-storage");
const randomPuseensTextarea = document.getElementById("randomPusheens-setting");
var { applicationSettings } = path.join(
  __dirname,
  "/src/store/defaultApplicationSettings.js"
);

function getPusheensFromStorage() {
  storage.get("randomPusheens", function (error, data) {
    if (error) throw error;

    randomPuseensTextarea.innerHTML = JSON.stringify(data, null, 4);
  });
}

function onDefaultPusheenSettingsSave() {
  console.log("saving...");
  storage.set(
    "randomPusheens",
    JSON.parse(randomPuseensTextarea.value),
    function (error) {
      if (error) throw error;

      getPusheensFromStorage();
    }
  );
}

function getApplicationSettings() {
  storage.get("applicationSettings", function (error, data) {
    if (error) throw error;

    if (Object.getOwnPropertyNames(data).length === 0) {
      storage.set("applicationSettings", applicationSettings, function (error) {
        if (error) throw error;
      });

      getApplicationSettings();
      return;
    } else {
      applicationSettings = data;
      onApplicationSettingLoad();
    }
  });
}

getApplicationSettings();
getPusheensFromStorage();

function onApplicationSettingsSave() {
  applicationSettings.windowHeight = document.querySelector(
    "#window-height"
  ).value;

  applicationSettings.windowWidth = document.querySelector(
    "#window-width"
  ).value;

  storage.set("applicationSettings", applicationSettings, function (error) {
    if (error) throw error;
  });

  getApplicationSettings();
}

function onApplicationSettingLoad() {
  document.querySelector("#window-height").value =
    applicationSettings.windowHeight;
  document.querySelector("#window-width").value =
    applicationSettings.windowWidth;
}
