import { WebClient } from '@slack/web-api';
import * as fs from 'fs';
import * as path from 'path';

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

async function uploadAudioFile(filePath, userId) {
    console.log(filePath)
  const fileStream = fs.createReadStream(filePath);
  const channel_id = await abrirDM(userId)

  try {
    const result = await slackClient.files.uploadV2({
      channel_id: channel_id,
      initial_comment: 'Aqui está o feedback que você acabou de receber!',
      file: fileStream,
      filename: path.basename(filePath)
    });
    console.log('Upload bem-sucedido!');
  } catch (error) {
    console.error('Falha ao enviar o áudio:', error);
  }
}




export { sendDM, abrirDM, uploadAudioFile };
