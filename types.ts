export enum AppState {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface StyleOption {
  id: string;
  name: string;
  prompt: string;
  icon: string; // Emoji or simple representative char
  color: string;
}

export interface GeneratedImage {
  original: string; // Base64
  modified: string; // Base64
  styleId: string;
}