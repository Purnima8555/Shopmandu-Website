import { FiDownload } from "react-icons/fi";
import Button from "../../../components/ui/Button";

export const InvoiceDownloadCard = ({ onDownload, downloading = false }) => (
  <div className="rounded-2xl border border-border bg-card p-5 mt-5 flex items-center justify-between gap-4 shadow-sm">
    <div>
      <p className="font-medium text-foreground">Invoice</p>
      <p className="text-sm text-muted-foreground">Download a copy of your invoice for this order.</p>
    </div>
    <Button
      variant="secondary"
      className="cursor-pointer flex items-center gap-2 flex-shrink-0"
      onClick={onDownload}
      disabled={downloading}
    >
      <FiDownload size={14} />
      {downloading ? "Preparing..." : "Download"}
    </Button>
  </div>
);
