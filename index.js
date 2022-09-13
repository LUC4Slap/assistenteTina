const startBtn = document.querySelector("#start");
const stopBtn = document.querySelector("#stop");
const output = document.querySelector("#output");
const recognition = new webkitSpeechRecognition();

// Instanciano a lib e definindo a linguagem
var voices = speechSynthesis.getVoices();
const voice = voices.filter((voice) => voice.lang.includes("BR"))[0];

function start() {
  recognition.interimResults = true;
  recognition.lang = "pt-BR";
  recognition.continuous = true;
  recognition.start();
  let texto = "";
  // This event happens when you talk in the microphone
  recognition.onresult = async function (event) {
    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        texto = event.results[i][0].transcript.trim();
        // Here you can get the string of what you told
        const content = texto;
        if (content.includes("tina") || content.includes("Tina")) {
          await falar(content);
          output.textContent = content;
        }
      }
    }
  };
}
function stop() {
  recognition.interimResults = false;
  recognition.lang = "pt-BR";
  recognition.continuous = false;
  recognition.stop();
}

async function falar(texto) {
  const paragrafo = {
    text: texto,
    play: async function () {
      let slit = this.text.replace("Tina", "");
      if (slit.includes("Que horas são") || slit.includes("que horas são")) {
        let hora = new Date().getHours();
        let minuto = new Date().getMinutes();
        const utterence = new SpeechSynthesisUtterance(
          `Agora são ${hora} horas e ${minuto} minutos`
        );
        utterence.voice = voice;
        speechSynthesis.speak(utterence);
      }
      if (slit.includes("Pesquisar") || slit.includes("pesquisar")) {
        let rep = slit.replace("pesquisar ", "");
        let pesquisa = await googleSearch(rep);
        const utterence = new SpeechSynthesisUtterance(pesquisa);
        utterence.voice = voice;
        speechSynthesis.speak(utterence);
        console.log(pesquisa);
      }
    },
    stop: function () {
      speechSynthesis.cancel();
    },
  };
  paragrafo.play();
  paragrafo.stop();
}
async function googleSearch(place) {
  let pesquisa = place.replaceAll(" ", "");
  var URLT = `https://www.googleapis.com/customsearch/v1?key=AIzaSyBf8Lulh5lDYsUi-db4D-UKkwC-sHYSNYI&cx=f7e7491d4d3f94037&gl=br&q=${pesquisa}`;
  let { data } = await axios.get(URLT);
  let numberRandom = Math.floor(Math.random() * data.items.length);
  return data.items[numberRandom].snippet;
}
startBtn.addEventListener("click", () => start());
stopBtn.addEventListener("click", () => stop());
