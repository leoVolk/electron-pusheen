const storage = require("electron-json-storage");

var emailInput = document.getElementById("emailInput");
var passwordInput = document.getElementById("passwordInput");
var noEmail = document.getElementById("noEmail");
var noPassword = document.getElementById("noPassword");
var submitButton = document.getElementById("submit");

function handleMailSettings() {
  storage.get("emailSettings", function (error, data) {
    if (data.email) noEmail.hidden = true;
    if (data.password) noPassword.hidden = true;
    if (error) throw error;
  });
}
handleMailSettings();

submitButton.addEventListener("click", function () {
  setMailSettings();
});

function setMailSettings() {
  storage.set("emailSettings", {
    email: emailInput.innerText,
    password: passwordInput.innerText,
  });
}
