/**
 * Envia uma string de texto para a OpenAI API com um prompt e retorna a resposta.
 * @param prompt O prompt a ser enviado (ex: "Resuma o texto:")
 * @param text O texto a ser processado pela IA
 * @returns A resposta da OpenAI como string, ou null em caso de erro
 */
export async function enviarParaOpenAI(text: string): Promise<string | null> {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  if (!apiKey) {
    alert("API Key não configurada");
    return null;
  }
  let prompt = (
    "Voce é um o Lino, assistente de IA e colega de trabalho de quem voce vai falar com! "+
    "Agradeça por compartilhar o áudio, e diga que ótimo ouvir suas ideias. " +
    "resuma a mensagem de forma clara, respeitosa e com um toque amigável, como se estivéssemos conversando no corredor da empresa. " +
    "seu objetivo é captar a essência do que a pessoa quis dizer e os sentimentos que expressou, sem repetir a transcrição inteira. " + 
    "O resumo será fluido, natural e sem placeholders ou instruções visíveis, usando apenas o conteúdo da transcrição fornecida. " +
    "Diga que se precisar de algum ajuste ou quiser conversar mais sobre isso, é só me chamar que trabalhamos juntos pra deixar tudo nos trilhos! " +
    "Olá! Aqui é o Lino, seu colega de equipe! \n" + 
    "Muito obrigado por compartilhar suas reflexões. Aqui está um resumo claro e direto do que você me contou, com toda atenção:\n\n" +
    "Resumo da sua mensagem:\n" +
    "Resuma a essência da mensagem da transcrição fornecida em um parágrafo claro, amigável e profissional, destacando os pontos principais e os sentimentos expressos, sem usar placeholders ou colchetes.\n\n" +
    "O que achou? Reflete bem o que você quis dizer? Se precisar ajustar algo ou conversar mais, é só me chamar que a gente resolve juntos! Estou aqui pra te apoiar.\n\n" +  
    "Transcrição fornecida: {transcription}"
  )

  const body = {
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: text }
    ],
    temperature: 0.7,
    max_tokens: 1024
  };

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error("Erro ao enviar para OpenAI");
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() ?? null;
  } catch (err) {
    console.error(err);
    return null;
  }
}