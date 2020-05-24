const heyListenAudio = new Audio('/Assets/sounds/hey_listen.mp3');

// @ts-ignore
const socket = io();

socket.on('attention', () => {
  console.log("Attention!");
  toggleNavi();
  setTimeout(() => {
    toggleNavi();
  }, 2000);
  heyListenAudio.play();
});

const toggleNavi = () => {
  const navi = document.getElementById("navi");
  navi?.classList.toggle("hidden");
}
