const chatForm = document.getElementById('chatForm');
// const msgInput = document.getElementById('msgInput');
const titlePage = document.getElementsByTagName('title')[0];

let countMessages = 0;

function initialize() {
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!myName) return alert('Primeiro entre com seu nome');
    const text = msgInput.value.trim();
    if (!text) return;
    const payload = { author: myName, text };
    socket.emit('chatMessage', payload);
    msgInput.value = '';

    addMessage(text, myName, true);
  });
}

function addMessage(text, author, isYou) {
  const div = document.createElement('div');
  div.className = 'message' + (isYou ? ' you' : '');
  const avatarEl = avatarFor(author);

  const bubble = document.createElement('div');
  bubble.className = 'bubble';

  const meta = document.createElement('div');
  meta.className = 'meta';
  meta.textContent =
    author + ' • ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const body = document.createElement('div');
  body.textContent = text;
  bubble.appendChild(meta);
  bubble.appendChild(body);
  div.appendChild(avatarEl);
  div.appendChild(bubble);
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;

  notificationNewMessage();
}

function notificationNewMessage() {
  countMessages += 1;

  titlePage.textContent =
    countMessages && !isTabVisible ? `Chat App (${countMessages})` : 'Chat App';
}

socket.on('chatMessage', (payload) => {
  if (payload.author === myName) return;
  addMessage(payload.text, payload.author, false);
});

initialize();
