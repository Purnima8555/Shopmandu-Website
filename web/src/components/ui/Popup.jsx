import { X } from "lucide-react";
import Button from "./Button";

const Popup = ({
    title = "Popup",
    children,
    isOpen,
    onClose,

    showFooter = false,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    maxWidth = "max-w-md",
}) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={onClose}
        >
            <div
                className={`w-full ${maxWidth} overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5">
                    <h2 className="text-lg font-bold text-foreground">
                        {title}
                    </h2>

                    <button
                        onClick={onClose}
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-2 text-lg leading-6 font-semibold">
                    {children}
                </div>

                {/* Footer */}
                {showFooter && (
                    <div className="flex justify-end gap-3 px-6 py-5">
                        <Button
                            variant="secondary"
                            onClick={onClose}
                        >
                            {cancelText}
                        </Button>

                        <Button
                            variant = "primary"
                            onClick={onConfirm}
                        >
                            {confirmText}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Popup;