import { X } from "lucide-react";

const Modal = ({
  title,
  children,
  onClose,
  maxWidth = "max-w-lg",
  maxHeight = "max-h-[85vh]",   // Adjustable
  showCloseButton = true,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className={`w-full ${maxWidth} ${maxHeight} flex flex-col rounded-xl border border-border bg-card`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-5 shrink-0">
          <h3 className="text-lg font-semibold">{title}</h3>

          {showCloseButton && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-muted-foreground cursor-pointer transition hover:bg-surface-hover"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;