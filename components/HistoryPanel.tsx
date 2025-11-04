
import React from 'react';
import { HistoryItem } from '../types';
import BackIcon from './icons/BackIcon';

interface HistoryPanelProps {
  isOpen: boolean;
  history: HistoryItem[];
  onClose: () => void;
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
}

const formatTimeAgo = (timestamp: number) => {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - timestamp) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return "Just now";
};

const HistoryPanel: React.FC<HistoryPanelProps> = ({ isOpen, history, onClose, onSelect, onClear }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className={`fixed top-0 right-0 bottom-0 w-full max-w-sm bg-gray-900 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <header className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">History</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700">
            <BackIcon className="w-6 h-6" />
          </button>
        </header>
        
        <div className="flex-grow overflow-y-auto p-4">
          {history.length === 0 ? (
            <div className="text-center text-gray-500 h-full flex flex-col justify-center items-center">
              <p>Your generated wallpapers will appear here.</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {history.map(item => (
                <li key={item.id}>
                  <button onClick={() => onSelect(item)} className="w-full flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-800 transition-colors text-left">
                    <img 
                      src={`data:image/jpeg;base64,${item.images[0].base64}`} 
                      alt={item.prompt}
                      className="w-16 h-28 object-cover rounded-md flex-shrink-0 bg-gray-700"
                    />
                    <div className="overflow-hidden">
                      <p className="font-semibold text-sm truncate">{item.prompt}</p>
                      <p className="text-xs text-gray-400">{formatTimeAgo(item.timestamp)}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {history.length > 0 && (
          <footer className="p-4 border-t border-gray-700">
            <button 
              onClick={onClear} 
              className="w-full bg-red-800/50 text-red-300 px-4 py-2 rounded-lg hover:bg-red-800/80 transition-colors"
            >
              Clear History
            </button>
          </footer>
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;
