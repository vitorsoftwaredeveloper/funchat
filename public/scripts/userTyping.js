const typingIndicator = document.getElementById('typingIndicator');

let typingUsers = new Set();
let typingTimeout;

function initialize() {
  msgInput.addEventListener('input', () => {
    if (!myName) return;
    sendTyping(true);
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      sendTyping(false);
    }, 800);
  });
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

socket.on('typing', ({ name, typing }) => {
  if (!name || name === myName) return;
  if (typing) typingUsers.add(name);
  else typingUsers.delete(name);
  renderTyping();
});

initialize();
