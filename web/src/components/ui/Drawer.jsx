

import { X } from "lucide-react";

const Drawer = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  maxWidth = "max-w-md" 
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-100 flex justify-end bg-black/50" 
      onClick={onClose}
    >
      <div
        className={`h-full w-full ${maxWidth} overflow-y-auto border-l border-border bg-card p-6`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <h3 className="font-display text-xl font-semibold">{title}</h3>
          <button 
            onClick={onClose} 
            className="rounded-lg p-1.5 hover:bg-surface"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Drawer;