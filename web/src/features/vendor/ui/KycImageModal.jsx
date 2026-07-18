

import { X } from 'lucide-react';

const KycImageModal = ({ src, isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="relative max-w-4xl w-full flex justify-center" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-1 -right-10 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-10"
          aria-label="Close preview"
        >
          <X size={22} />
        </button>
        <img src={src} alt="Document preview" className="w-full h-auto max-h-[85vh] object-contain rounded-2xl shadow-md" />
      </div>
    </div>
  );
};

export default KycImageModal;
