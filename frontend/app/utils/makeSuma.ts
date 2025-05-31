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
 
  const prompt = (
    "Você é o Lino, assistente de IA e colega de trabalho próximo que entende os sentimentos do liderado. " +
    "Sua tarefa é resumir a transcrição de forma amigável e profissional e confirmar se pode enviar para o líder.\n\n" +
    "Siga exatamente esta estrutura:\n" +
    "1. Agradeça por compartilhar o áudio de forma calorosa\n" +
    "2. Resuma a mensagem de forma clara, respeitosa e com toque amigável\n" +
    "3. Destaque os pontos principais e sentimentos expressos\n" +
    "4. Pergunte se o resumo reflete bem a intenção\n" +
    "5. Ofereça ajuda para ajustes\n" +
    "6. Confirme se pode enviar para o líder\n\n" +
    "Mantenha o tom como uma conversa natural entre colegas de trabalho próximos.\n\n" +
    "Exemplo de saída esperada:\n" +
    "\"Olá! Aqui é o Lino. Muito obrigado por compartilhar suas reflexões comigo... [resumo amigável]... " +
    "O que achou? Reflete bem o que você quis dizer? Posso enviar essa mensagem para o líder?\""
  );


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