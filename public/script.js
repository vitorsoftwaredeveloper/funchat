const socket = io();

const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value.trim()) {
    socket.emit("chatMessage", input.value);
    input.value = "";
  }
});

socket.on("chatMessage", (msg) => {
  const li = document.createElement("li");
  li.textContent = msg;
  messages.appendChild(li);
  window.scrollTo(0, document.body.scrollHeight);
});
