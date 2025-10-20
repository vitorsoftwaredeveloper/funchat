const socket = io();

const attachBtn = document.getElementById('attachBtn');
const imageInput = document.getElementById('imageInput');
const modalClose = document.getElementById('modalClose');
const modalBackdrop = document.getElementById('modalBackdrop');
const messagesEl = document.getElementById('messages');

function initialize() {
  attachBtn.addEventListener('click', () => imageInput.click());

  imageInput.addEventListener('change', (ev) => {
    const file = ev.target.files && ev.target.files[0];
    if (!file) return;

    // validate mime type and size (4MB)
    validateImageSize(file);

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      // check image dimensions before sending
      const imgCheck = new Image();
      imgCheck.onload = async () => {
        const maxDim = 3000;
        if (imgCheck.naturalWidth > maxDim || imgCheck.naturalHeight > maxDim) {
          return alert(`Imagem com dimensões muito grandes (max ${maxDim}x${maxDim}).`);
        }

        // send immediately
        const prevText = attachBtn.textContent;
        try {
          attachBtn.disabled = true;
          attachBtn.textContent = 'Enviando...';
          const payload = { author: myName, dataUrl, time: new Date().toISOString() };
          // slight delay to show feedback
          await new Promise((r) => setTimeout(r, 200));
          socket.emit('image', payload);
          addImageMessage(dataUrl, myName, true);
        } catch (err) {
          alert('Erro ao enviar a imagem');
        } finally {
          attachBtn.disabled = false;
          attachBtn.textContent = prevText;
        }
      };
      imgCheck.src = dataUrl;
    };
    reader.readAsDataURL(file);
    // clear selection so same file can be selected again
    imageInput.value = '';
  });

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

  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') {
      const modal = document.getElementById('imageModal');
      if (modal) modal.style.display = 'none';
    }
  });

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
}

function validateImageSize(file) {
  const maxSize = 4 * 1024 * 1024; // 4MB
  if (!file.type || !file.type.startsWith('image/'))
    return alert('Tipo inválido — selecione uma imagem.');
  if (file.size > maxSize) return alert('Arquivo muito grande (max 4MB)');
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
    author + ' • ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

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

socket.on('image', ({ author, dataUrl, time }) => {
  if (!dataUrl) return;
  if (author === myName) return; // avoid duplicate (we already appended on send)
  addImageMessage(dataUrl, author, false);
});

initialize();
