const joinForm = document.getElementById('joinForm');
const nameInput = document.getElementById('nameInput');
const joinBtn = document.getElementById('joinBtn');
const chatSection = document.getElementById('chatSection');
const msgInput = document.getElementById('msgInput');

let myName = '';

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
}

function newMemberJoined(name) {
  const div = document.createElement('div');
  div.className = 'new-member';
  div.textContent = name + ' entrou no chat';
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

socket.on('newMember', ({ name }) => {
  newMemberJoined(name);
});

initialize();
