let isTabVisible = !document.hidden;

function initialize() {
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

initialize();
