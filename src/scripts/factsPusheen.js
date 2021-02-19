const { default: axios } = require("axios");

var speechBubble = document.getElementById("speech-bubble");
getRandomFact();
function getRandomFact() {
  console.log("Getting new one");
  axios
    .get("https://uselessfacts.jsph.pl/random.json?language=en")
    .then(function (res) {
      speechBubble.innerHTML =
        res.data.text +
        "<b><a onclick='getRandomFact()' style='-webkit-app-region: no-drag; cursor:pointer;'> next fact</a></b>";
    });
}
