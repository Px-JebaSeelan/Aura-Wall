
import React, { useState } from 'react';
import { GeneratedImage, DownloadQuality } from '../types';
import DownloadIcon from './icons/DownloadIcon';
import RemixIcon from './icons/RemixIcon';
import BackIcon from './icons/BackIcon';
import ShareIcon from './icons/ShareIcon';
import { reEncodeImage } from '../utils/imageUtils';

interface ImageViewerProps {
  image: GeneratedImage;
  onClose: () => void;
  onRemix: (prompt: string) => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ image, onClose, onRemix }) => {
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (quality: DownloadQuality) => {
    setShowQualityMenu(false);
    setIsDownloading(true);

    let imageBase64 = image.base64;
    let qualityLabel = 'high';

    try {
        if (quality === 'medium') {
          imageBase64 = await reEncodeImage(image.base64, 0.75);
          qualityLabel = 'medium';
        } else if (quality === 'low') {
          imageBase64 = await reEncodeImage(image.base64, 0.5);
          qualityLabel = 'low';
        }

        const link = document.createElement('a');
        link.href = `data:image/jpeg;base64,${imageBase64}`;
        const safeFilename = `AuraWall_${image.prompt.slice(0, 30).replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${qualityLabel}.jpeg`;
        link.download = safeFilename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch(error) {
        console.error("Failed to re-encode and download image:", error);
        alert("An error occurred while preparing the download.");
    } finally {
        setIsDownloading(false);
    }
  };
  
  const handleRemix = () => {
    onRemix(image.prompt);
  };

  const handleShare = async () => {
    try {
      const response = await fetch(`data:image/jpeg;base64,${image.base64}`);
      const blob = await response.blob();
      const safeFilename = `AuraWall_${image.prompt.slice(0, 30).replace(/[^a-z0-9]/gi, '_').toLowerCase()}.jpeg`;
      const file = new File([blob], safeFilename, { type: 'image/jpeg' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'AuraWall Wallpaper',
          text: `Check out this wallpaper I made with AuraWall: "${image.prompt}"`,
        });
      } else {
        alert("This image can't be shared from your browser.");
      }
    } catch (error) {
      // User cancellation of the share dialog is not an error.
      if ((error as Error).name !== 'AbortError') {
        console.error('Sharing failed:', error);
        alert('An error occurred while trying to share the image.');
      }
    }
  };

  const canShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center animate-fade-in" onClick={onClose}>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/80 transition-colors"
      >
        <BackIcon className="w-6 h-6" />
      </button>

      <div className="w-full h-full flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
         <img
            src={`data:image/jpeg;base64,${image.base64}`}
            alt={image.prompt}
            className="max-h-full max-w-full object-contain rounded-lg"
          />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center items-center space-x-4 bg-gradient-to-t from-black/80 to-transparent">
        <div className="relative">
          {isDownloading && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900/80 px-3 py-1 rounded-md text-sm whitespace-nowrap">
              Preparing download...
            </div>
          )}
          {showQualityMenu && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 flex flex-col items-stretch space-y-1.5" role="menu">
              <button
                role="menuitem"
                onClick={() => handleDownload('high')}
                className="flex items-center justify-center space-x-2 bg-white/20 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-full hover:bg-white/30 transition-colors text-sm"
              >
                <span>High Quality</span>
              </button>
              <button
                role="menuitem"
                onClick={() => handleDownload('medium')}
                className="flex items-center justify-center space-x-2 bg-white/20 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-full hover:bg-white/30 transition-colors text-sm"
              >
                <span>Medium Quality</span>
              </button>
              <button
                role="menuitem"
                onClick={() => handleDownload('low')}
                className="flex items-center justify-center space-x-2 bg-white/20 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-full hover:bg-white/30 transition-colors text-sm"
              >
                <span>Low Quality</span>
              </button>
            </div>
          )}
          <button
            onClick={() => setShowQualityMenu(!showQualityMenu)}
            disabled={isDownloading}
            className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-full hover:bg-white/30 transition-colors disabled:opacity-50"
            aria-haspopup="true"
            aria-expanded={showQualityMenu}
          >
            <DownloadIcon />
            <span>Download</span>
          </button>
        </div>
        {canShare && (
           <button
             onClick={handleShare}
             className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-full hover:bg-white/30 transition-colors"
           >
             <ShareIcon />
             <span>Share</span>
           </button>
        )}
        <button
          onClick={handleRemix}
          className="flex items-center space-x-2 bg-purple-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-purple-700 transition-colors"
        >
          <RemixIcon />
          <span>Remix</span>
        </button>
      </div>
    </div>
  );
};

export default ImageViewer;
