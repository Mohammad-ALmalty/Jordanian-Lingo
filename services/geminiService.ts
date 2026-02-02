
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { audioService } from "./audioService";

export const getTutorChatStream = async (history: any[] = [], userLevelName: string = 'Beginner') => {
  // Always create a new instance to ensure we pick up the latest API key from the environment/dialog
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const geminiHistory = history.map(m => ({
    role: m.role,
    parts: [{ text: m.text }]
  }));

  return ai.models.generateContentStream({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are "Sami", a professional Jordanian AI Tutor. 
      Your task is to teach Jordanian Ammiya (colloquial Arabic) to English speakers.

      STRICT OUTPUT FORMAT (Every part on a NEW LINE):
      Line 1: The Jordanian Arabic translation only.
      Line 2: The English Transliteration only.
      Line 3+: A clear explanation in ENGLISH only.

      RULES:
      - Use ENGLISH for all explanations and conversation.
      - Use ARABIC only for the specific phrase being taught on the first line.
      - The structure must be strictly line-by-line (no merged paragraphs).
      - Maintain a helpful, authentic Jordanian persona.
      - Level Context: ${userLevelName}.

      Note: If the user asks general questions, still respond in English, but follow the line-by-line logic if providing translations.`,
      thinkingConfig: { thinkingBudget: 0 }
    },
    contents: geminiHistory
  });
};

export const extractArabicForTTS = (text: string): string => {
  const lines = text.split('\n');
  const firstLine = lines[0] || "";
  return firstLine.replace(/[^\u0600-\u06FF\s؟!.،]/g, '').trim();
};

export const generateSpeech = async (text: string) => {
  const cleanText = extractArabicForTTS(text);
  if (!cleanText) return null;
  
  const cached = audioService.getCachedAudio(cleanText);
  if (cached) return cached;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: cleanText }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      audioService.setCachedAudio(cleanText, base64Audio);
      return base64Audio;
    }
  } catch (error) { 
    console.error("TTS Error", error);
    return null; 
  }
};
