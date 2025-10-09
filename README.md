# Chat App (demo)

Pequeno app de chat usando Express + Socket.io. Tema escuro com tons de azul para combinar com o portfólio.

## Estrutura

- `server/server.js` - servidor Express + Socket.io
- `public/` - frontend estático
  - `index.html`, `style.css`, `script.js`
- `package.json`

## Como rodar

1. Instale dependências:

```bash
cd chat-app
npm install
```

2. Rode o servidor (exemplo usando porta 3001):

```bash
PORT=3001 npm start
```

3. Abra no navegador:

http://localhost:3001

Observação: se a porta 3000 estiver em uso, ajuste `PORT` como no exemplo acima.

## Funcionalidades

- Conexão em tempo real com Socket.io
- Enviar/receber mensagens
- Indicador "está digitando..."
- Avatares gerados por iniciais

## Próximos passos (sugestões)

- Persistir histórico (ex: Redis ou DB leve)
- Sistema de salas / DM
- Autenticação e persistência de usuários
- Melhor tratamento de reconexão e confirmações de entrega
