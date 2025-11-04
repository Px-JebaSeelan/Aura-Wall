import React, { useState } from 'react';
import { AspectRatio } from '../types';
import SparklesIcon from './icons/SparklesIcon';
import LightbulbIcon from './icons/LightbulbIcon';
import { generateSurprisePrompt } from '../services/geminiService';

interface PromptFormProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  aspectRatio: AspectRatio;
  onAspectRatioChange: (ratio: AspectRatio) => void;
}

const aspectRatios: AspectRatio[] = ["9:16", "16:9", "1:1", "4:3", "3:4"];

const PromptForm: React.FC<PromptFormProps> = ({ prompt, onPromptChange, onSubmit, isLoading, aspectRatio, onAspectRatioChange }) => {
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSubmit();
    }
  };

  const handleSurpriseMe = async () => {
    setIsGeneratingPrompt(true);
    try {
      const newPrompt = await generateSurprisePrompt();
      onPromptChange(newPrompt);

      // Select and apply a random aspect ratio
      const randomIndex = Math.floor(Math.random() * aspectRatios.length);
      const randomRatio = aspectRatios[randomIndex];
      onAspectRatioChange(randomRatio);

    } catch (error) {
      console.error(error);
      // Optionally show an error to the user
    } finally {
      setIsGeneratingPrompt(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-sm p-4 border-t border-gray-700">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex flex-col items-center space-y-3">
        <button
            type="button"
            onClick={handleSurpriseMe}
            disabled={isLoading || isGeneratingPrompt}
            className="flex items-center space-x-2 text-sm font-medium text-gray-300 bg-gray-700 px-4 py-2 rounded-full hover:bg-gray-600 hover:text-white transition-colors disabled:opacity-50 disabled:bg-gray-800"
            aria-label="Generate surprise prompt"
          >
            {isGeneratingPrompt ? (
              <>
                <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                <span>Generating idea...</span>
              </>
            ) : (
              <>
                <LightbulbIcon className="w-4 h-4" />
                <span>Surprise Me</span>
              </>
            )}
          </button>
        <div className="w-full flex items-center bg-gray-800 border border-gray-700 rounded-full p-1.5 pr-2 focus-within:ring-2 focus-within:ring-purple-500 transition-all shadow-lg">
          <input
            type="text"
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder="Describe your vibe..."
            className="flex-grow bg-transparent border-none focus:outline-none focus:ring-0 p-2 pl-4 text-base placeholder-gray-500 text-gray-200"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="flex-shrink-0 w-10 h-10 bg-purple-600 text-white rounded-full font-semibold disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center justify-center"
            aria-label="Generate wallpapers"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
            ) : (
              <SparklesIcon className="w-5 h-5" />
            )}
          </button>
        </div>
        <div className="flex items-center justify-center space-x-2">
            {aspectRatios.map(ratio => (
                <button
                    key={ratio}
                    type="button"
                    onClick={() => onAspectRatioChange(ratio)}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${aspectRatio === ratio ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                >
                    {ratio}
                </button>
            ))}
        </div>
      </form>
    </div>
  );
};

export default PromptForm;