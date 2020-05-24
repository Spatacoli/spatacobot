const heyListenAudio = new Audio('/Assets/sounds/hey_listen.mp3');

// @ts-ignore
const socket = io();

socket.on('attention', () => {
  console.log("Attention!");
  heyListenAudio.play();
});
