const socket = io();

const messagesEl = document.getElementById('messages');
const chatForm = document.getElementById('chatForm');
const msgInput = document.getElementById('msgInput');
const nameInput = document.getElementById('nameInput');
const joinBtn = document.getElementById('joinBtn');
const chatSection = document.getElementById('chatSection');
const typingIndicator = document.getElementById('typingIndicator');
const joinForm = document.getElementById('joinForm');

let myName = '';
let typingUsers = new Set();
let typingTimeout;

joinForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const value = nameInput.value.trim();
  if (!value) return alert('Digite um nome');
  myName = value;

  nameInput.style.visibility = 'hidden';
  joinBtn.style.visibility = 'hidden';

  chatSection.style.display = 'flex';
  socket.emit('newMember', { name: myName });
  msgInput.focus();
});

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

msgInput.addEventListener('input', () => {
  if (!myName) return;
  sendTyping(true);
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    sendTyping(false);
  }, 800);
});

function avatarFor(name) {
  const initials = name[0].toUpperCase();

  const hue = Array.from(name).reduce((s, c) => s + c.charCodeAt(0), 0) % 360;
  const bg = `linear-gradient(135deg, hsl(${hue}deg 70% 45%), hsl(${(hue + 30) % 360}deg 70% 40%))`;
  const el = document.createElement('div');

  el.className = 'avatar-sm';
  el.style.background = bg;
  el.title = name;
  el.style.display = 'flex';
  el.style.alignItems = 'center';
  el.style.justifyContent = 'center';
  el.style.color = 'rgba(255,255,255,0.95)';
  el.style.fontWeight = '700';
  el.style.padding = '5px';
  el.style.width = '30px';
  el.style.height = '30px';
  el.style.borderRadius = '100%';
  el.textContent = initials;
  return el;
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
}

function newMemberJoined(name) {
  const div = document.createElement('div');
  div.className = 'new-member';
  div.textContent = name + ' entrou no chat';
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function sendTyping(isTyping) {
  socket.emit('typing', { name: myName, typing: isTyping });
}

function renderTyping() {
  if (typingUsers.size === 0) {
    typingIndicator.textContent = '';
    return;
  }
  const arr = Array.from(typingUsers);
  typingIndicator.textContent =
    arr.slice(0, 3).join(', ') +
    (arr.length > 3 ? ` e mais ${arr.length - 3}...` : '') +
    ' está digitando...';
}

socket.on('chatMessage', (payload) => {
  if (payload.author === myName) return;
  addMessage(payload.text, payload.author, false);
});

socket.on('typing', ({ name, typing }) => {
  if (!name || name === myName) return;
  if (typing) typingUsers.add(name);
  else typingUsers.delete(name);
  renderTyping();
});

socket.on('newMember', ({ name }) => {
  newMemberJoined(name);
});
