export type ViewportMode = 'desktop' | 'tablet' | 'mobile';

export interface VirtualFile {
  name: string;
  path: string;
  language: string;
  content: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  isMap?: boolean;
}
