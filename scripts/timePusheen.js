var speechBubble = document.getElementById("speech-bubble");
var pusheenImg = document.getElementById("pusheen");
var imgBasePath = "./assets/pusheens/time/";

const fs = require("fs");

// first tick
tick_fast();
tick_long();
// update every second
setInterval(function () {
  tick_fast();
}, 1000);

setInterval(function () {
  tick_long();
}, 1000 * 60 * 30);

function setPusheen() {
  pusheenImg.src = imgBasePath + getPusheenByTimeOfDay();
  pusheenImg.srcset = imgBasePath + getPusheenByTimeOfDay();
}

function setSpeechBubble(text) {
  speechBubble.innerText = text;
}

function tick_fast() {
  setSpeechBubble("It's currently: " + new Date().toLocaleTimeString());
}

function tick_long() {
  setPusheen();
}

function getPusheenByTimeOfDay() {
  const currentHour = new Date().getHours();
  let path = "";
  let rand;
  //TODO: FIX THIS SHIT
  if (currentHour >= 6 && currentHour < 12) {
    path = "morning";
  } else if (currentHour >= 12 && currentHour < 14) {
    path = "lunch";
  } else if (currentHour >= 14 && currentHour < 19) {
    path = "morning";
  } else if (currentHour >= 19 && currentHour < 23) {
    path = "evening";
  } else {
    path = "night";
  }

  rand = Math.round(
    Math.random() * (fs.readdirSync(imgBasePath + path).length - 1)
  );
  return path + "/" + path + "_" + rand + ".gif";
}
