import { X } from "lucide-react";
import Button from "./Button";

const Popup = ({
    title = "Popup",
    children,
    isOpen,
    onClose,

    // footer options
    showFooter = false,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,

    confirmVariant = "primary",

    maxWidth = "max-w-md",
}) => {

    if (!isOpen) return null;


    return (

        <div className=" fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={onClose}>
            <div
                className={` w-full ${maxWidth} rounded-2xl border border-border bg-card shadow-lg animation-fade-in`}
                onClick={(e)=>e.stopPropagation()}>

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-0.5">
                    <h2
                        className="text-lg font-semibold text-foreground">
                        {title}
                    </h2>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-muted-foreground hover:bg-surface transition cursor-pointer"
                    >
                        <X size={18}/>
                    </button>
                </div>

                {/* Content */}
                <div
                    className="px-6 py-5 text-sm text-muted-foreground">
                    {children}
                </div>

                {/* Footer */}
                {showFooter && (
                    <div
                        className="flex justify-end gap-3 px-6 py-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onClose}
                        >
                            {cancelText}
                        </Button>

                        <Button
                            variant={confirmVariant}
                            size="sm"
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