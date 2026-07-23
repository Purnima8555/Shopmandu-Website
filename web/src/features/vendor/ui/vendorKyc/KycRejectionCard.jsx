

import { AlertCircle } from 'lucide-react';

const KycRejectionCard = ({ reason }) => (
  <div className="bg-danger/10 border border-danger/20 rounded-2xl shadow-md p-5 flex items-start gap-4">
    <span className="shrink-0 p-2.5 rounded-xl bg-danger/15 text-danger">
      <AlertCircle size={20} />
    </span>
    <div>
      <h4 className="text-sm font-bold text-danger">Reason for Rejection</h4>
      <p className="text-sm text-muted-foreground mt-1">{reason || 'No reason was provided. Please contact support for details.'}</p>
    </div>
  </div>
);

export default KycRejectionCard;