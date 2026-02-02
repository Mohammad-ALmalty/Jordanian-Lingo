
import { db } from '../infrastructure/DatabaseService';

export class ExportService {
  static async exportToJSON() {
    const phrases = await db.phrases.toArray();
    const messages = await db.messages.toArray();
    const progress = await db.progress.get('current');

    const data = {
      exportedAt: new Date().toISOString(),
      userProgress: progress,
      phrasebook: phrases,
      chatHistory: messages
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `jordanian-lingo-backup-${new Date().getTime()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
