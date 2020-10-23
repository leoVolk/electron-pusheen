const { ipcRenderer } = require("electron");

var closeBtn = document.getElementById("close");

closeBtn.addEventListener("click", function () {
    ipcRenderer.send('hideMailWindow');
});
