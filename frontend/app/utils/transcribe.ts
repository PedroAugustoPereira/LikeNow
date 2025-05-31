// Função para transcrever áudio usando a API da OpenAI
export async function transcreverAudio(audioBlob: Blob): Promise<string | null> {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY; // Defina sua chave de API no .env.local
  if (!apiKey) {
    alert("API Key não configurada");
    return null;
  }

  const formData = new FormData();
  formData.append("file", audioBlob, "audio.wav");
  formData.append("model", "whisper-1");
  formData.append("language", "pt");

  try {
    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Erro ao transcrever o áudio");
    }

    const data = await response.json();
    return data.text as string;
  } catch (err) {
    console.error(err);
    return null;
  }
}