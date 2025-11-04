import React, { useState, useCallback } from 'react';
import { generateWallpapers } from './services/geminiService';
import { GeneratedImage, AspectRatio, HistoryItem } from './types';
import PromptForm from './components/PromptForm';
import ImageGrid from './components/ImageGrid';
import ImageViewer from './components/ImageViewer';
import SparklesIcon from './components/icons/SparklesIcon';
import HistoryIcon from './components/icons/HistoryIcon';
import HistoryPanel from './components/HistoryPanel';
import useLocalStorage from './hooks/useLocalStorage';
import LogoIcon from './components/icons/LogoIcon';

const App: React.FC = () => {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');
  const [prompt, setPrompt] = useState('');

  const [history, setHistory] = useLocalStorage<HistoryItem[]>('auraWallHistory', []);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setError(null);
    setImages([]);
    
    try {
      const generatedImages = await generateWallpapers(prompt, aspectRatio);
      setImages(generatedImages);
      setHistory(prevHistory => [
        { id: crypto.randomUUID(), prompt, images: generatedImages, timestamp: Date.now() },
        ...prevHistory
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, aspectRatio, setHistory]);

  const handleRemix = useCallback((remixPrompt: string) => {
    setSelectedImage(null);
    setPrompt(remixPrompt);
    setTimeout(() => handleGenerate(), 100);
  }, [handleGenerate]);

  const handleSelectHistory = (item: HistoryItem) => {
    setPrompt(item.prompt);
    setImages(item.images);
    setIsHistoryOpen(false);
    setError(null);
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear your entire generation history? This cannot be undone.")) {
      setHistory([]);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-center text-gray-400 gap-4">
          <SparklesIcon className="w-16 h-16 animate-pulse text-purple-400" />
          <p className="text-lg">Generating your vibe...</p>
          <p className="text-sm">This can take a moment.</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">
          <h3 className="font-bold">Generation Failed</h3>
          <p>{error}</p>
        </div>
      );
    }

    if (images.length > 0) {
      return <ImageGrid images={images} onImageClick={setSelectedImage} />;
    }

    return (
      <div className="flex flex-col items-center justify-center text-center text-gray-500 gap-4">
        <SparklesIcon className="w-16 h-16" />
        <h2 className="text-2xl font-bold text-gray-300">AuraWall</h2>
        <p>Describe your next wallpaper to begin.</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col">
       <header className="p-4 flex justify-between items-center max-w-4xl w-full mx-auto">
        <div className="w-10"></div>
        <div className="text-center flex flex-col items-center">
           <div className="flex items-center space-x-2">
            <LogoIcon className="w-7 h-7 text-purple-400" />
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
              AuraWall
            </h1>
          </div>
          <p className="text-sm text-gray-400 -mt-1">AI Wallpaper Generator</p>
        </div>
        <button onClick={() => setIsHistoryOpen(true)} className="p-2 rounded-full hover:bg-gray-700/50 transition-colors" aria-label="Open history">
          <HistoryIcon className="w-6 h-6"/>
        </button>
      </header>
      
      <main className="flex-grow flex flex-col items-center justify-center p-4 max-w-4xl w-full mx-auto pb-44">
        {renderContent()}
      </main>

      {selectedImage && (
        <ImageViewer
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          onRemix={handleRemix}
        />
      )}
      
      <HistoryPanel
        isOpen={isHistoryOpen}
        history={history}
        onClose={() => setIsHistoryOpen(false)}
        onSelect={handleSelectHistory}
        onClear={handleClearHistory}
      />

      <PromptForm 
        prompt={prompt}
        onPromptChange={setPrompt}
        onSubmit={handleGenerate} 
        isLoading={isLoading}
        aspectRatio={aspectRatio}
        onAspectRatioChange={setAspectRatio}
      />
    </div>
  );
};

export default App;