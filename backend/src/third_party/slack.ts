import { WebClient } from '@slack/web-api';
const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);

// Função para abrir/obter DM
async function abrirDM(userId) {
  const res = await slackClient.conversations.open({ users: userId });
  if (!res.ok) throw new Error(res.error);
  return res.channel.id;
}

// Função para enviar a mensagem
async function sendDM(userId, texto) {
  userId = 'U08UMRX2SG6';  
  const channelId = await abrirDM(userId);
  const postRes = await slackClient.chat.postMessage({
    channel: channelId,
    text: texto,
    username: 'NotificadorNode',
  });
  if (!postRes.ok) console.error('Erro:', postRes.error);
  else console.log('Mensagem enviada! ts=', postRes.ts);
}


export { sendDM, abrirDM };
