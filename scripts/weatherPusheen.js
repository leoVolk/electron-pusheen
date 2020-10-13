var speechBubble = document.getElementById("speech-bubble");
var pusheenImg = document.getElementById("pusheen");
var imgBasePath = "../assets/pusheens/weather/";

const axios = require("axios");
const { get } = require("jquery");
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

function setPusheen(imgName) {
  pusheenImg.style.visibility = "visible";
  pusheenImg.src = imgBasePath + imgName + ".gif";
}

function setSpeechBubble(text) {
  speechBubble.innerText = text;
}

function tick_fast() {
  //setSpeechBubble("The weather is shit");
}

function tick_long() {
  setPusheen();
  getWeather();
}

async function getWeather() {
  setSpeechBubble("Loading...");
  pusheenImg.style.visibility = "hidden";
  await axios
    .get("https://freegeoip.app/json/")
    .then(async function (response) {
      await axios
        .get(
          "https://www.metaweather.com/api/location/search/?lattlong=" +
            response.data.latitude +
            "," +
            response.data.longitude
        )
        .then(async function (response) {
          await axios
            .get(
              "https://www.metaweather.com/api/location/" +
                response.data[0].woeid
            )
            .then(function (response) {
              return setWeather(response.data.consolidated_weather[0]);
            })
            .catch(function (error) {
              console.log(error);
            });
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        });
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
}

function setWeather(weather) {
  //see:
  //https://www.metaweather.com/api/
  switch (weather.weather_state_abbr) {
    case "sn":
      setPusheen("snow");
      setSpeechBubble("It's snowing! Get your sledge!");
      break;
    case "sl":
      setPusheen("snow");
      setSpeechBubble("Sleet, EWW! All the mud...");
      break;
    case "h":
      setPusheen("snow");
      setSpeechBubble("It's hailing man! No, seriously, don't go out.");
      break;
    case "t":
      setPusheen("rain");
      setSpeechBubble("Rain? Enjoy a cup of tea and relax!");
      break;
    case "hr":
      setPusheen("rain");
      setSpeechBubble("Rain? Enjoy a cup of tea and relax!");
      break;
    case "lr":
      setPusheen("rain");
      setSpeechBubble("It's only light rain...");
      break;
    case "s":
      setPusheen("rain");
      setSpeechBubble("It's not going to be sunny for long with these showers!");
      break;
    default:
      setPusheen("sunny");
  }
  
}
