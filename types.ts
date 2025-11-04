
export interface GeneratedImage {
  id: string;
  base64: string;
  prompt: string;
}

export interface HistoryItem {
  id: string;
  prompt: string;
  images: GeneratedImage[];
  timestamp: number;
}

export type AspectRatio = "9:16" | "16:9" | "1:1" | "4:3" | "3:4";

export type DownloadQuality = 'high' | 'medium' | 'low';
