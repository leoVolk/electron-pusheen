const path = require("path");
var speechBubble = document.getElementById("speech-bubble");
var pusheenImg = document.getElementById("pusheen");
var imgBasePath = path.join(__dirname, "../assets/pusheens/");

setPusheen = (pusheen) => {
  if (!pusheen) return;

  if (pusheen.text === "") speechBubble.hidden = true;
  else speechBubble.hidden = false;

  clearArtifacts();

  pusheenImg.src = pusheen.imgUrl;
  speechBubble.innerHTML = pusheen.text;
};

clearArtifacts = () => {
  pusheenImg.hidden = true;
  speechBubble.hidden = true;

  pusheenImg.hidden = false;
  speechBubble.hidden = false;
};

const randomPusheens = [
  {
    imgUrl:
      "https://media3.giphy.com/media/lC5M3eqe8yUc1wHZo2/giphy.gif?cid=ecf05e47wysr2syuaugbqxio1viwucbor9gfxnzi3eabve4w&rid=giphy.gif",
    text: "",
  },
  {
    imgUrl: "https://media1.giphy.com/media/cLZfxeYaDz6x6a5Iqq/giphy.gif",
    text: "Judging you...",
  },
  {
    imgUrl: "https://media1.giphy.com/media/KFQYlsgTDgNuYTrNC0/giphy.gif",
    text: "You're looking great today, wow!",
  },
  {
    imgUrl: "https://media2.giphy.com/media/SWEfsr2Z2rj7ZvE1Zo/giphy.gif",
    text: "Nice tunes!",
  },
  {
    imgUrl:
      "https://media3.giphy.com/media/lC5M3eqe8yUc1wHZo2/giphy.gif?cid=ecf05e47wysr2syuaugbqxio1viwucbor9gfxnzi3eabve4w&rid=giphy.gif",
    text: "",
  },
  {
    imgUrl:
      "https://media3.giphy.com/media/lC5M3eqe8yUc1wHZo2/giphy.gif?cid=ecf05e47wysr2syuaugbqxio1viwucbor9gfxnzi3eabve4w&rid=giphy.gif",
    text: "",
  },
  {
    imgUrl:
      "https://media3.giphy.com/media/lC5M3eqe8yUc1wHZo2/giphy.gif?cid=ecf05e47wysr2syuaugbqxio1viwucbor9gfxnzi3eabve4w&rid=giphy.gif",
    text: "",
  },
];

setInterval(setPusheen(randomPusheens[3]));
