
class AudioService {
  private static instance: AudioService;
  private context: AudioContext | null = null;
  private cache: Map<string, string> = new Map();
  private activeSource: AudioBufferSourceNode | null = null;

  private constructor() {}

  public static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }

  public getContext(): AudioContext {
    if (!this.context) {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    if (this.context.state === 'suspended') {
      this.context.resume();
    }
    return this.context;
  }

  public stopAll(): void {
    if (this.activeSource) {
      try {
        this.activeSource.stop();
      } catch (e) {
        // Source might have already stopped
      }
      this.activeSource = null;
    }
  }

  public getCachedAudio(key: string): string | undefined {
    return this.cache.get(key);
  }

  public setCachedAudio(key: string, data: string): void {
    this.cache.set(key, data);
  }

  private decode(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  private async decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  }

  public async play(base64Data: string): Promise<void> {
    this.stopAll();
    const ctx = this.getContext();
    const audioBuffer = await this.decodeAudioData(this.decode(base64Data), ctx, 24000, 1);
    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);
    source.start();
    this.activeSource = source;
  }
}

export const audioService = AudioService.getInstance();
