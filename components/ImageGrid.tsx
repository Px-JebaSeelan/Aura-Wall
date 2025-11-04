
import React, { useState } from 'react';
import { GeneratedImage, DownloadQuality } from '../types';
import DownloadIcon from './icons/DownloadIcon';
import ZoomInIcon from './icons/ZoomInIcon';
import { reEncodeImage } from '../utils/imageUtils';

interface ImageGridProps {
  images: GeneratedImage[];
  onImageClick: (image: GeneratedImage) => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({ images, onImageClick }) => {
  const [activeDownloadMenu, setActiveDownloadMenu] = useState<string | null>(null);

  const handleDownload = async (e: React.MouseEvent, image: GeneratedImage, quality: DownloadQuality) => {
    e.stopPropagation();
    setActiveDownloadMenu(null); // Close menu after selection

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
      // 'high' uses original base64
  
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
    }
  };

  const handleZoom = (e: React.MouseEvent, image: GeneratedImage) => {
    e.stopPropagation();
    onImageClick(image);
  };

  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4 p-2 sm:p-4">
      {images.map((image) => (
        <div
          key={image.id}
          className="aspect-[9/16] bg-gray-800 rounded-lg overflow-hidden cursor-pointer group relative"
          onClick={() => onImageClick(image)}
        >
          <img
            src={`data:image/jpeg;base64,${image.base64}`}
            alt={image.prompt}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute bottom-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
                onClick={(e) => handleZoom(e, image)}
                className="bg-black/50 text-white p-2 rounded-full hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Zoom in"
              >
              <ZoomInIcon className="w-5 h-5" />
            </button>
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveDownloadMenu(activeDownloadMenu === image.id ? null : image.id);
                }}
                className="bg-black/50 text-white p-2 rounded-full hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Download image"
              >
                <DownloadIcon className="w-5 h-5" />
              </button>
              {activeDownloadMenu === image.id && (
                <div 
                  className="absolute bottom-full right-0 mb-2 w-28 bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-md shadow-lg z-10"
                  onClick={e => e.stopPropagation()}
                >
                  <ul className="text-sm text-white" role="menu">
                    <li><button role="menuitem" onClick={(e) => handleDownload(e, image, 'high')} className="w-full text-left px-3 py-1.5 hover:bg-purple-600 transition-colors rounded-t-md">High</button></li>
                    <li><button role="menuitem" onClick={(e) => handleDownload(e, image, 'medium')} className="w-full text-left px-3 py-1.5 hover:bg-purple-600 transition-colors">Medium</button></li>
                    <li><button role="menuitem" onClick={(e) => handleDownload(e, image, 'low')} className="w-full text-left px-3 py-1.5 hover:bg-purple-600 transition-colors rounded-b-md">Low</button></li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;
