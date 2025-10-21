const recordBtn = document.getElementById('recordBtn');

let mediaRecorder = null;
let recordingChunks = [];

function initialize() {
  if (!recordBtn) return;

  recordBtn.addEventListener('click', async () => {
    if (!myName) return alert('Digite um nome antes de gravar áudio');

    if (mediaRecorder?.state === 'recording') {
      mediaRecorder.stop();
      recordBtn.textContent = '🎤';
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recordingChunks = [];

      mediaRecorder = new MediaRecorder(
        stream,
        MediaRecorder.isTypeSupported('audio/webm')
          ? { mimeType: 'audio/webm' }
          : { mimeType: 'audio/mp4' }
      );

      mediaRecorder.ondataavailable = (chunk) => {
        if (chunk.data && chunk.data.size > 0) recordingChunks.push(chunk.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordingChunks, { type: mediaRecorder.mimeType });
        const reader = new FileReader();

        reader.onload = () => {
          const dataUrl = reader.result;
          const payload = { author: myName, dataUrl, time: new Date().toISOString() };

          socket.emit('audio', payload);
          sendAudioMessage(dataUrl, myName, true);
        };

        reader.onerror = () => {
          alert('Erro ao processar áudio');
        };

        reader.readAsDataURL(blob);

        try {
          stream.getTracks().forEach((t) => t.stop());
        } catch (e) {}
      };

      mediaRecorder.start();
      recordBtn.textContent = '◼️';
    } catch (err) {
      alert('Não foi possível acessar o microfone: ' + (err && err.message));
    }
  });
}

function sendAudioMessage(dataUrl, author, isYou) {
  const div = document.createElement('div');
  div.className = 'message' + (isYou ? ' you' : '');
  const avatarEl = avatarFor(author);

  const bubble = document.createElement('div');
  bubble.className = 'bubble';

  const meta = document.createElement('div');
  meta.className = 'meta';
  meta.textContent =
    author + ' • ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const audio = document.createElement('audio');
  audio.controls = true;
  audio.src = dataUrl;
  audio.className = 'chat-audio';

  bubble.appendChild(meta);
  bubble.appendChild(audio);
  div.appendChild(avatarEl);
  div.appendChild(bubble);
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

socket.on('audio', ({ author, dataUrl, time }) => {
  if (!dataUrl) return;
  if (author === myName) return; // avoid duplicate when sender already appended
  sendAudioMessage(dataUrl, author, false);
});

initialize();
