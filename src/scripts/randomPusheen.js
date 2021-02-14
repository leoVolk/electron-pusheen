const storage = require("electron-json-storage");
var speechBubble = document.getElementById("speech-bubble");
var pusheenImg = document.getElementById("pusheen");
var pusheens;

storage.clear(function (error) {
  if (error) throw error;
});

setPusheen = (pusheen) => {
  if (!pusheen) return;

  //clearArtifacts();

  if (pusheen.text == "") {
    speechBubble.parentElement.hidden = true;
  } else {
    speechBubble.parentElement.hidden = false;
  }

  pusheenImg.src = pusheen.imgUrl;
  speechBubble.innerHTML = pusheen.text;
};

getRandomFromArray = (arr) => {
  return arr[~~(arr.length * Math.random())];
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
    imgUrl: "https://media2.giphy.com/media/QOczQMdwpwLZichFSF/giphy.gif",
    text: "",
  },
  {
    imgUrl:
      "https://media3.giphy.com/media/2t9uOZF2BrRlWxiTE9/giphy.gif?cid=ecf05e472ne3pe7nfghsadyfs6gs4bps8mbpgwn8e5ap63bg&rid=giphy.gif",
    text: "",
  },
  {
    imgUrl: "https://media1.giphy.com/media/Mb4Qy9QsdiuavGJgp8/giphy.gif",
    text: "",
  },
  {
    imgUrl:
      "https://media1.giphy.com/media/g3MqFMQ97lmKxwECTa/giphy.gif?cid=ecf05e47yfb2qjo9jc7pk9j9f4jwef2btnsk25oygdnjl3sl&rid=giphy.gif",
    text: "What'cha doing?",
  },
  {
    imgUrl:
      "https://media2.giphy.com/media/D0ZpFzZC0QcX1DrqSL/giphy.gif?cid=ecf05e47urrkfm7qe4gwjef9sv3a8g0drkkp8l2ujt59oug2&rid=giphy.gif",
    text: "",
  },
  {
    imgUrl: "https://media4.giphy.com/media/pOTEhtq8Jv7voNl7mb/giphy.gif",
    text: "Be fabulous!",
  },
  {
    imgUrl:
      "https://media3.giphy.com/media/LSEO0PbppXB0fEe8bh/200w.webp?cid=ecf05e47bhpjn1bwgxmifee9ud5badhmllktttfkpwxqlncq&rid=200w.webp",
    text: "Omnomnom",
  },
  {
    imgUrl:
      "https://media3.giphy.com/media/SV0UrYruj5E9Fa1Amp/200w.webp?cid=ecf05e47bhpjn1bwgxmifee9ud5badhmllktttfkpwxqlncq&rid=200w.webp",
    text: "Spend time with your loved ones",
  },
  {
    imgUrl:
      "https://media3.giphy.com/media/KYgE8A80wxoCI4AsH5/200w.webp?cid=ecf05e47i38vkc88iy9b6dyegtpxmyklm163el4f364z5l7n&rid=200w.webp",
    text: "Wake up!",
  },
  {
    imgUrl:
      "https://media3.giphy.com/media/KCk58tCLuSSX2DisLX/200w.webp?cid=ecf05e47i38vkc88iy9b6dyegtpxmyklm163el4f364z5l7n&rid=200w.webp",
    text: "Treat yourself. :)",
  },
  {
    imgUrl:
      "https://media3.giphy.com/media/dtHmOEgyUTnXhKx5OX/200w.webp?cid=ecf05e479l7pvpqx2swctwhyh7x0veo5bhpk82dpkj6pzoda&rid=200w.webp",
    text: "BooooHooooo",
  },
];


//TODO: rewrite to async
// storage.get().then()
function getPusheensFromStorage() {
  storage.get("randomPusheens", function (error, data) {
    if (error) throw error;

    if (Object.getOwnPropertyNames(data).length === 0) {
      storage.set("randomPusheens", randomPusheens, function (error) {
        if (error) throw error;
      });

      getPusheensFromStorage();
      return;
    } else {
      console.log(data);
      pusheens = data;

      setPusheen(getRandomFromArray(pusheens));
      setInterval(function () {
        setPusheen(getRandomFromArray(pusheens));
      }, 1000 * 60 * 10);
    }
  });
}

getPusheensFromStorage();

