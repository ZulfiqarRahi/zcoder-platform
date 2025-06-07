const socket = io();
const room = window.chatRoom;
const username = window.username;
socket.emit("joinRoom", { room, username });

const sendBtn = document.getElementById("sendBtn");
const msgInput = document.getElementById("messageInput");
const messagesDiv = document.getElementById("messages");

sendBtn.addEventListener("click", () => {
  const message = msgInput.value.trim();
  if (message) {
    socket.emit("sendMessage", { room, message, username });
    msgInput.value = "";
  }
});

socket.on("receiveMessage", ({ message, sender }) => {
  const el = document.createElement("div");
  el.className = `message ${sender === username ? "self" : "other"}`;

  const senderEl = document.createElement("div");
  senderEl.className = "sender";
  senderEl.textContent = sender;

  const msgEl = document.createElement("div");
  msgEl.textContent = message;

  el.appendChild(senderEl);
  el.appendChild(msgEl);
  messagesDiv.appendChild(el);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

socket.on("systemMessage", (text) => {
  const el = document.createElement("div");
  el.className = "system-message";
  el.textContent = text;
  messagesDiv.appendChild(el);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});