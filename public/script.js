const socket = io();

const messagesEl = document.getElementById('messages');
const chatForm = document.getElementById('chatForm');
const msgInput = document.getElementById('msgInput');
const nameInput = document.getElementById('nameInput');
const joinBtn = document.getElementById('joinBtn');
const chatSection = document.getElementById('chatSection');
const typingIndicator = document.getElementById('typingIndicator');
const joinForm = document.getElementById('joinForm');
const titlePage = document.getElementsByTagName('title')[0];

let myName = '';
let typingUsers = new Set();
let typingTimeout;
let countMessages = 0;
let isTabVisible = !document.hidden;

function updateVisibility() {
  const visible = !document.hidden;
  isTabVisible = visible;

  countMessages = 0;
  titlePage.textContent = 'Chat App';

  // Quando a aba deixa de ser vista, pare de anunciar "typing"
  if (!visible) {
    sendTyping(false);
    clearTimeout(typingTimeout);
  }
}

function initialize() {
  msgInput.disabled = true;
  nameInput.focus();

  joinForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = nameInput.value.trim();
    if (!value) return alert('Digite um nome');
    myName = value;

    nameInput.style.visibility = 'hidden';
    joinBtn.style.visibility = 'hidden';

    chatSection.style.display = 'flex';
    socket.emit('newMember', { name: myName });
    msgInput.disabled = false;
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

  // preview removed — images are sent immediately on selection

  // modal logic: open when clicking chat images
  document.addEventListener('click', (e) => {
    const target = e.target;
    if (target && target.classList && target.classList.contains('chat-image')) {
      const modal = document.getElementById('imageModal');
      const modalImg = document.getElementById('modalImg');
      const modalCaption = document.getElementById('modalCaption');
      if (modal && modalImg) {
        modalImg.src = target.src;
        modalCaption.textContent = target.alt || '';
        modal.style.display = 'flex';
      }
    }
  });

  const modalClose = document.getElementById('modalClose');
  const modalBackdrop = document.getElementById('modalBackdrop');
  if (modalClose)
    modalClose.addEventListener(
      'click',
      () => (document.getElementById('imageModal').style.display = 'none')
    );
  if (modalBackdrop)
    modalBackdrop.addEventListener(
      'click',
      () => (document.getElementById('imageModal').style.display = 'none')
    );

  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') {
      const modal = document.getElementById('imageModal');
      if (modal) modal.style.display = 'none';
    }
  });

  msgInput.addEventListener('input', () => {
    if (!myName) return;
    sendTyping(true);
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      sendTyping(false);
    }, 800);
  });

  // Eventos para capturar mudança de visibilidade / foco
  document.addEventListener('visibilitychange', () => updateVisibility());
  window.addEventListener('focus', () => updateVisibility());
  window.addEventListener('blur', () => updateVisibility());

  // Garantir que o servidor saiba quando o usuário fecha/fecha a aba
  // isso aqui vai ser legal para mostrar quando um usuário está online ou offline
  window.addEventListener('beforeunload', () => {
    if (myName) socket.emit('visibility', { name: myName, visible: false });
  });
}

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

  notificationNewMessage();
}

function addImageMessage(dataUrl, author, isYou) {
  const div = document.createElement('div');
  div.className = 'message' + (isYou ? ' you' : '');
  const avatarEl = avatarFor(author);
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  const meta = document.createElement('div');
  meta.className = 'meta';
  meta.textContent =
    author +
    ' • ' +
    new Date(dataUrl ? Date.now() : Date.now()).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  const img = document.createElement('img');
  img.src = dataUrl;
  img.alt = 'imagem enviada';
  img.className = 'chat-image';
  bubble.appendChild(meta);
  bubble.appendChild(img);
  div.appendChild(avatarEl);
  div.appendChild(bubble);
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function notificationNewMessage() {
  countMessages += 1;

  titlePage.textContent =
    countMessages && !isTabVisible ? `Chat App (${countMessages})` : 'Chat App';
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

initialize();

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

// receive images from server
socket.on('image', ({ author, dataUrl, time }) => {
  if (!dataUrl) return;
  if (author === myName) return; // avoid duplicate (we already appended on send)
  addImageMessage(dataUrl, author, false);
});
