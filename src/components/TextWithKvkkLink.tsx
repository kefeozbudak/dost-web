import React from 'react';
import { openKvkkModal } from './KvkkModal';

const TextWithKvkkLink = ({ text, className = "" }: { text: string, className?: string }) => {
  if (!text) return null;
  
  const parts = text.split(/(KVKK)/g);
  
  return (
    <span className={className}>
      {parts.map((part, i) => 
        part === 'KVKK' ? (
          <button 
            key={i} 
            type="button" 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); openKvkkModal(); }}
            className="text-blue-600 hover:text-blue-800 underline font-semibold transition-colors mx-1"
          >
            KVKK
          </button>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
};

export default TextWithKvkkLink;
