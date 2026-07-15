import {
  ShieldCheck, CheckCircle2, Clock, AlertCircle, ShieldX, FilePlus,
} from 'lucide-react';

export const kycStatus = Object.freeze({
  APPROVED_STATUS: 'APPROVE',
  PENDING_STATUS: 'PENDING',
  REJECTED_STATUS: 'REJECT',
});

//// initalize the status of kyc.
export const { APPROVED_STATUS, PENDING_STATUS, REJECTED_STATUS } = kycStatus;
export const NOT_SUBMITTED = 'NOT_SUBMITTED';

/// formate date for kyc submit, approved etc.
export const formatDate = (d) => {
  if (!d) return null;
  try {
    return new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return null;
  }
};

//// content shown in the top status banner, keyed by kycStatus value.
export const STATUS_CONTENT = {
  [APPROVED_STATUS]: {
    tone: 'success',
    icon: ShieldCheck,
    title: 'KYC Successfully Verified',
    description:
      'Your identity has been verified successfully. Your seller account is now fully verified and you can access all marketplace features.',
    badge: 'Fully Verified',
    badgeIcon: CheckCircle2,
  },
  [PENDING_STATUS]: {
    tone: 'warning',
    icon: Clock,
    title: 'Verification In Progress',
    description:
      'Your KYC documents are currently under review. This usually takes 12–24 hours. Please wait until our team completes the verification.',
    badge: 'Under Review',
    badgeIcon: Clock,
  },
  [REJECTED_STATUS]: {
    tone: 'danger',
    icon: ShieldX,
    title: 'Verification Rejected',
    description:
      'Unfortunately your submitted documents could not be approved. Please review the rejection reason below, correct the information, and resubmit your documents.',
    badge: 'Action Required',
    badgeIcon: AlertCircle,
  },
  [NOT_SUBMITTED]: {
    tone: 'primary',
    icon: FilePlus,
    title: 'Complete Your Identity Verification',
    description:
      'Submit your identity documents to unlock vendor verification, secure payouts, and build trust with customers.',
    badge: 'Not Submitted',
    badgeIcon: FilePlus,
  },
};

export const TONE_CLASSES = {
  success: {
    wrap: 'bg-success/10 border-success/20',
    iconWrap: 'bg-success/15 text-success',
    badge: 'bg-success/15 text-success',
  },
  warning: {
    wrap: 'bg-warning/10 border-warning/20',
    iconWrap: 'bg-warning/15 text-warning',
    badge: 'bg-warning/15 text-warning',
  },
  danger: {
    wrap: 'bg-danger/10 border-danger/20',
    iconWrap: 'bg-danger/15 text-danger',
    badge: 'bg-danger/15 text-danger',
  },
  primary: {
    wrap: 'bg-primary/10 border-primary/20',
    iconWrap: 'bg-primary/15 text-primary',
    badge: 'bg-primary/15 text-primary',
  },
};

//// dot color per timeline-step state
export const TIMELINE_DOT_CLASSES = {
  completed: 'bg-success/10 border-success text-success',
  active: 'bg-warning/10 border-warning text-warning animate-pulse',
  rejected: 'bg-danger/10 border-danger text-danger',
  pending: 'bg-background border-border text-muted-foreground',
};

//// Builds the 3 step vertical timeline data from the current status + KYC record 
export const buildTimelineSteps = (status, record) => {
  const submittedDate = formatDate(record?.createdAt) || 'Not started';
  const reviewedDate = formatDate(record?.updatedAt);

  const step1 = {
    title: 'Documents Submitted',
    desc: 'Your KYC information and documents were received.',
    date: status === NOT_SUBMITTED ? 'Not started' : submittedDate,
    status: status === NOT_SUBMITTED ? 'pending' : 'completed',
  };

  const step2 = {
    title: 'Verification Under Review',
    desc:
      status === REJECTED_STATUS
        ? 'Our team reviewed the submission and found an issue.'
        : 'Our team is reviewing your documents and details.',
    date:
      status === PENDING_STATUS
        ? 'In progress'
        : status === APPROVED_STATUS || status === REJECTED_STATUS
        ? reviewedDate || 'Reviewed'
        : 'Pending',
    status: status === NOT_SUBMITTED ? 'pending' : status === PENDING_STATUS ? 'active' : 'completed',
  };

  const step3 =
    status === REJECTED_STATUS
      ? {
          title: 'Verification Rejected',
          desc: 'Please correct the highlighted issues and resubmit.',
          date: reviewedDate || 'Rejected',
          status: 'rejected',
        }
      : {
          title: 'Approved',
          desc: 'Your account is fully verified and active.',
          date: status === APPROVED_STATUS ? reviewedDate || 'Approved' : 'Pending',
          status: status === APPROVED_STATUS ? 'completed' : 'pending',
        };

  return [step1, step2, step3];
};