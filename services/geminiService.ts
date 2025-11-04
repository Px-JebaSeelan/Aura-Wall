
import { GoogleGenAI } from "@google/genai";
import { GeneratedImage, AspectRatio } from '../types';

export async function generateWallpapers(prompt: string, aspectRatio: AspectRatio): Promise<GeneratedImage[]> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 4,
        outputMimeType: 'image/jpeg',
        aspectRatio: aspectRatio,
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      return response.generatedImages.map(img => ({
        id: crypto.randomUUID(),
        base64: img.image.imageBytes,
        prompt: prompt,
      }));
    } else {
      throw new Error("No images were generated. The prompt may have been blocked.");
    }
  } catch (error) {
    console.error("Error generating images:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate images: ${error.message}`);
    }
    throw new Error("An unknown error occurred during image generation.");
  }
}


export async function generateSurprisePrompt(): Promise<string> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey });
  const metaPrompt = `Generate a short, creative, and visually descriptive prompt for an AI image generator. The prompt should describe a scene, vibe, or an interesting concept. Be concise and evocative. Don't use markdown or quotes. Example: A neon-lit cyberpunk city street in a downpour.`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: metaPrompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating surprise prompt:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate a surprise prompt: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating a surprise prompt.");
  }
}
