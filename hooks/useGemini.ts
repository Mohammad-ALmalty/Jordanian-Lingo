
import { useState, useCallback, useEffect } from 'react';
import { getTutorChatStream } from '../services/geminiService';
import { ChatMessage } from '../types';
import { useApp } from '../AppContext';
import { db } from '../infrastructure/DatabaseService';

export const useGemini = () => {
  const { currentRank } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initial load from DB
  useEffect(() => {
    const loadChat = async () => {
      const history = await db.messages.orderBy('timestamp').toArray();
      setMessages(history);
    };
    loadChat();
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    setError(null);
    const userMsg: ChatMessage = { role: 'user', text, timestamp: new Date() };
    await db.messages.add(userMsg);
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const responseStream = await getTutorChatStream([...messages, userMsg], currentRank.name);
      
      let fullText = "";
      const modelMsgPlaceholder: ChatMessage = { role: 'model', text: "", timestamp: new Date() };
      setMessages(prev => [...prev, modelMsgPlaceholder]);

      for await (const chunk of responseStream) {
        fullText += chunk.text;
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].text = fullText;
          return updated;
        });
      }
      
      // Save full model response to DB
      await db.messages.add({ role: 'model', text: fullText, timestamp: new Date() });
      
    } catch (err: any) {
      console.error("Gemini Error Caught:", err);
      
      // تحويل الخطأ إلى نص للبحث عن الأكواد البرمجية
      const errorString = typeof err === 'string' ? err : (err.message || JSON.stringify(err));
      
      if (errorString.includes('429') || errorString.includes('RESOURCE_EXHAUSTED')) {
        setError('QUOTA_EXHAUSTED');
      } else if (errorString.includes('403') || errorString.includes('401') || errorString.includes('API_KEY_INVALID')) {
        setError('INVALID_KEY');
      } else if (errorString.includes('404') || errorString.includes('NOT_FOUND')) {
        setError('NOT_FOUND');
      } else {
        setError('GENERIC_ERROR');
      }
      
      // إزالة رسالة النموذج الفارغة إذا حدث خطأ قبل البدء
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last && last.role === 'model' && !last.text) {
          return prev.slice(0, -1);
        }
        return prev;
      });
    } finally {
      setIsTyping(false);
    }
  }, [messages, currentRank]);

  const clearError = () => setError(null);

  return { messages, isTyping, error, sendMessage, clearError };
};
