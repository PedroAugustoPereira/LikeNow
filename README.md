# LikeNow

**1º lugar na Hackatona PUCRS 2025**

O LikeNow é uma plataforma de feedback assistida por IA.  
Com o **Lino**, colaboradores podem gravar ou escrever um feedback, revisar a mensagem com ajuda de IA e enviar isso para a liderança de forma mais clara, profissional e, se quiserem, anônima.

> Para entender melhor o processo de desenvolvimento do projeto e sua arquitetura, vá para a wiki!

## O que o projeto faz

- Recebe feedback por áudio ou texto
- Transcreve e reorganiza a mensagem com IA
- Permite revisão antes do envio
- Suporta envio anônimo
- Entrega o feedback ao líder e integra com Slack

## Stack

- Frontend: Next.js
- Backend: NestJS
- Banco: PostgreSQL + Prisma
- IA: OpenAI
- Integração: Slack
- Infra local: Docker Compose

## Como rodar

1. Configure as variáveis de ambiente.

Backend:
- `DATABASE_URL`
- `OPENAI_API_KEY`
- `SLACK_BOT_TOKEN`
- `PROMPT`

Frontend:
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_OPENAI_API_KEY`

2. Suba o projeto:

```bash
docker compose up --build
```

3. Acesse:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3010`

## Estrutura

- `frontend/`: interface do usuário
- `backend/`: API, autenticação, feedbacks e integrações
- `wikiImages/`: imagens de apoio do projeto
- `slides.pptx`: apresentação do projeto
