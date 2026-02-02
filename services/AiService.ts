
import { GoogleGenAI, Modality } from "@google/genai";
import { ChatMessage } from "../types";

export interface IAiService {
  getChatStream(history: ChatMessage[], levelName: string): Promise<any>;
  generateSpeech(text: string): Promise<string | null>;
}

class GeminiAiService implements IAiService {
  // Always instantiate inside the method to pick up the most recent process.env.API_KEY
  // after the user has used openSelectKey()

  async getChatStream(history: ChatMessage[], levelName: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const contents = history.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    return ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `You are "Sami", a Jordanian AI Tutor. 
        Your goal is to teach Jordanian dialect to English speakers.
        
        MANDATORY FORMAT FOR TRANSLATIONS:
        Line 1: Jordanian Arabic text ONLY.
        Line 2: English Transliteration ONLY.
        Line 3+: Detailed explanation in ENGLISH ONLY.

        CRITICAL: Everything except the first line must be in English. 
        Every part MUST be on a new line. Do not group them.
        Tone: Professional, Helpful, Jordanian 🇯🇴.
        Level: ${levelName}.`,
        thinkingConfig: { thinkingBudget: 0 }
      },
      contents
    });
  }

  async generateSpeech(text: string): Promise<string | null> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const firstLine = text.split('\n')[0];
    const cleanText = firstLine.replace(/[^\u0600-\u06FF\s؟!.،]/g, '').trim();
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: cleanText }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
        },
      });
      return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
    } catch (e) {
      console.error("TTS Error", e);
      return null;
    }
  }
}

export const aiService = new GeminiAiService();
