const attachBtn = document.getElementById('attachBtn');
const imageInput = document.getElementById('imageInput');

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

function validateImageSize(file) {
  const maxSize = 4 * 1024 * 1024; // 4MB
  if (!file.type || !file.type.startsWith('image/'))
    return alert('Tipo inválido — selecione uma imagem.');
  if (file.size > maxSize) return alert('Arquivo muito grande (max 4MB)');
}
