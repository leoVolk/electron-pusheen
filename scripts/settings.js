const { ipcRenderer } = require("electron");
const storage = require("electron-json-storage");
const path = require("path");
const gmailText = require(path.join(
  __dirname,
  "../scripts/partials/info_GoogleMail.js"
));

const outlookText = require(path.join(
  __dirname,
  "../scripts/partials/info_Outlook.js"
));

const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const noEmail = document.getElementById("noEmail");
const noPassword = document.getElementById("noPassword");
const submitButton = document.getElementById("submitBtn");
const infoField = document.getElementById("infoField");
const imapSelect = document.getElementById("imap-select");

let imapSettings = {};
imapSelect.addEventListener("change", function () {
  if (imapSelect.value == 1) {
    imapSettings.host = "imap.gmail.com";
    imapSettings.port = "993";
    infoField.innerHTML = gmailText;
  } else if (imapSelect.value == 2) {
    imapSettings.host = "Outlook.office365.com";
    imapSettings.port = "993";
    infoField.innerHTML = outlookText;
  }
});

function getMailSettings() {
  storage.get("emailSettings", function (error, data) {
    console.log(data);
    if (data.email) noEmail.hidden = true;
    if (data.password) noPassword.hidden = true;

    if (data.password && data.email) {
      emailInput.value = data.email;
      passwordInput.value = data.password;
    }

    if (data.host && data.port) {
      imapSettings.host = data.host;
      imapSettings.port = data.port;

      if (data.host == "imap.gmail.com") {
        imapSelect.value = 1;
        infoField.innerHTML = gmailText;
      } else if (data.host == "Outlook.office365.com") {
        imapSelect.value = 2;
        infoField.innerHTML = outlookText;
      }
    } else {
      imapSettings = { host: "imap.gmail.com", port: "993" };
    }
    if (error) throw error;
  });
}

getMailSettings();

submitButton.addEventListener("click", function () {
  setMailSettings();
});

function setMailSettings() {
  storage.set(
    "emailSettings",
    {
      email: emailInput.value,
      password: passwordInput.value,
      host: imapSettings.host,
      port: imapSettings.port,
    },
    function (error) {
      if (error) throw error;
    }
  );

  ipcRenderer.send("updatedMailer");

  storage.get("emailSettings", function (error, data) {
    console.log(data);
  });
}