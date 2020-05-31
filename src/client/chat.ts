const chatTextArea = document.getElementById("chatTextArea") as HTMLTextAreaElement;

// @ts-ignore
const socket = io();

socket.on('join', (user: any[]) => {
    chatTextArea.innerText += user[0] + "/n";
});
