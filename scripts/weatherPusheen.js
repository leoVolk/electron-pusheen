var speechBubble = document.getElementById("speech-bubble");
var pusheenImg = document.getElementById("pusheen");
var imgBasePath = "../assets/pusheens/";

// first tick
tick_fast();
tick_long();

// update every second
setInterval(function () {
  tick_fast();
}, 1000);

//update every half hour
setInterval(function () {
  tick_long();
}, 1000 * 60 * 30);

function setPusheen() {
  pusheenImg.src = imgBasePath + "default.gif";
}

function setSpeechBubble(text) {
  speechBubble.innerText = text;
}

function tick_fast() {
  //setSpeechBubble("The weather is shit");
}

function tick_long() {
  setSpeechBubble("The weather is shit");
  setPusheen();
}
