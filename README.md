# FunChat

Pequeno aplicativo de chat em tempo real (protótipo).

URL principal (produção): https://funchat-jwip.onrender.com/

Também é possível rodar localmente em: http://localhost:3000

## Resumo

Servidor Node.js com Express que serve o frontend estático e usa Socket.io para mensagens em tempo real. O cliente é uma app simples em HTML/CSS/vanilla JS.

Funcionalidades principais

- Chat em tempo real (texto)
- Envio de imagens (cliente lê imagem como DataURL e envia via Socket.io)
- Gravação de áudio no cliente (MediaRecorder) e envio por socket (reprodução nos outros clientes)

# FunChat

Pequeno aplicativo de chat em tempo real (protótipo).

**URL principal (produção):** https://funchat-jwip.onrender.com/

Também é possível rodar localmente em: http://localhost:3000

## Resumo

Servidor Node.js com Express que serve o frontend estático e usa Socket.io para mensagens em tempo real. O cliente é uma app simples em HTML/CSS/vanilla JS.

## Funcionalidades principais

- Chat em tempo real (texto)
- Envio de imagens (cliente lê imagem como DataURL e envia via Socket.io)
- Gravação de áudio no cliente (MediaRecorder) e envio por socket (reprodução nos outros clientes)
- Indicador de "digitando"
- Avatares simples gerados a partir das iniciais do nome
- Modal de visualização para imagens

## Estrutura do projeto

- `server/` - servidor Express + Socket.io (`server/server.js`)
- `public/` - frontend estático
  - `index.html`, `style.css`
  - `public/scripts/` - pequenos módulos frontend (anexar imagem, gravação, mensagens, etc.)
- `package.json`

## Como rodar (desenvolvimento)

1. Instale dependências:

```bash
npm install
```

2. Inicie o servidor:

```bash
node server/server.js
```

3. Abra o navegador na URL principal (local):

```
http://localhost:3000
```

<strong>Abra em mais de uma aba/janela para testar envio/recepção entre clientes.</strong>

## Próximos passos recomendados

- Implementar upload HTTP para imagens/áudio e retornar URLs (mais robusto).
- Persistência de mensagens (DB) e paginação no cliente.
- Melhorar UX: toasts, indicador de gravação, limitar duração máxima de gravação, barra de progresso de upload.
- Refatorar frontend em módulos (já iniciamos essa divisão em `public/scripts/`).

## Contribuição

Sinta-se livre para abrir issues ou PRs.

## Recursos existentes

- Deve permitir inserir imagens
- Deve permitir gravar áudios

## Melhorias futuras

- Deve bloquear o mesmo nome
- Deve permitir colocar videos
- Deve permitir inserir documentos
- Deve armazenar histórico de conversas
- Deve permitir contato com várias pessoas através do seu link ou url
- Quando alguém falar disparar som e notificação na aba
- Lmpar o campo de nome para nao duplicar a aba e ter o mesmo nome
- Implementar alguma modelo de toastify para avisos
- Refatorar frontend em módulos (já iniciamos essa divisão em `public/scripts/`).
