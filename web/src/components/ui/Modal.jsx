import { X } from "lucide-react";
import Button from "./Button";

const Modal = ({
  title,
  children,
  onClose,
  onSubmit,
  submitText = "Save",
  cancelText = "Cancel",
  maxWidth = "max-w-lg",
  showCloseButton = true,
  showFooter = true,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className={`w-full ${maxWidth} rounded-xl border border-border bg-card p-6`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>

          {showCloseButton && (
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-muted-foreground hover:bg-surface"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="mt-5">
          {children}
        </div>

        {/* Footer */}
        {showFooter && (
          <div className="mt-6 flex gap-3">
            <Button onClick={onClose}
            className="cursor-pointer" variant="secondary">
              {cancelText}
            </Button>

            <Button onClick={onSubmit}
            className="cursor-pointer">
              {submitText}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;