import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ShieldCheck,
  Clock,
  RefreshCcw,
  User,
  Landmark,
  FileText,
  Upload,
} from "lucide-react";

// Store, Components, Constants
import useVendorStore from "../../../store/vendorStore";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import vendorkycSchema from "../../../schemas/vendorKyc.validation";

import {
  APPROVED_STATUS,
  PENDING_STATUS,
  REJECTED_STATUS,
  NOT_SUBMITTED,
} from "../util/kycConstants";
import KycImageModal from "../ui/KycImageModal";
import KycFileUploader from "../ui/KycFileUploader";
import KycStatusBanner from "../ui/KycStatusBanner";
import KycProgressTimeline from "../ui/KycProgressTimeline";
import KycRejectionCard from "../ui/KycRejectionCard";
import Loader from "../../../components/common/Loader";
import sendApiRequest from "../../../utils/sendApiRequest";
import { dismissToast, showSuccess } from "../../../utils/toast";

const KycVerifiaction = () => {
  const {
    vendorKyc,
    vendorKycStatus,
    loading,
    getVendorKyc,
    getVendorKycStatus,
    submitVendorKyc,
    resubmitVendorKyc,
  } = useVendorStore();

  const [localLoading, setLocalLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [previewModal, setPreviewModal] = useState({ open: false, src: "" });
  const [notSubmitted, setNotSubmitted] = useState(false);

  const [files, setFiles] = useState({
    frontSideImage: null,
    backSideImage: null,
  });
  const [previews, setPreviews] = useState({ front: null, back: null });
  const [fileErrors, setFileErrors] = useState({});

  // Backend returns { kycStatus, rejectionReason }. A 404 (no record) is treated as NOT_SUBMITTED.
  const currentStatus = notSubmitted
    ? NOT_SUBMITTED
    : vendorKycStatus?.kycStatus || NOT_SUBMITTED;
  const isApproved = currentStatus === APPROVED_STATUS;
  const isPending = currentStatus === PENDING_STATUS;
  const isRejected = currentStatus === REJECTED_STATUS;
  const isNotSubmitted = currentStatus === NOT_SUBMITTED;
  const isEditable = isNotSubmitted || isRejected;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(vendorkycSchema),
    defaultValues: {
      fullName: "",
      bankDetails: {
        accountNumber: "",
        accountHolderName: "",
        bankName: "",
        branchName: "",
      },
      citizenship: { number: "", dateOfBirth: "" },
      nidNumber: "",
      panNumber: "",
    },
  });

  const init = async () => {
    setLocalLoading(true);
    setNotSubmitted(false);
    try {
      const statusRes = await getVendorKycStatus();  /// send request to backend for checked kyc status.

      if (statusRes && statusRes.kycStatus) {
        const kycData = await getVendorKyc();  /// send request to backend for get kyc details data.
        if (kycData) {
          reset({
            fullName: kycData.fullName,
            bankDetails: { ...kycData.bankDetails },
            citizenship: {
              number: kycData.citizenship?.number,
              dateOfBirth: kycData.citizenship?.dateOfBirth?.split("T")[0],
            },
            nidNumber: kycData.nidNumber,
            panNumber: kycData.panNumber,
          });
          setPreviews({
            front: kycData.citizenship?.frontSideImage,
            back: kycData.citizenship?.backSideImage,
          });
        }
      } else {
        setNotSubmitted(true);
      }
    } catch (err) {
      if (err?.response?.status === 404 || err?.status === 404) {
        setNotSubmitted(true);
      } else {
        console.error(err);
      }
    } finally {
      setLocalLoading(false);
    }
  };

  useEffect(() => {
    init();
  }, []);

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setFiles((p) => ({ ...p, [field]: file }));
      setPreviews((p) => ({
        ...p,
        [field === "frontSideImage" ? "front" : "back"]:
          URL.createObjectURL(file),
      }));
      setFileErrors((p) => ({ ...p, [field]: null }));
    }
  };

  const onSubmit = async (data) => {
    if (!files.frontSideImage && !previews.front) {
      return setFileErrors({ frontSideImage: "Front image is required" });
    }
    if (!files.backSideImage && !previews.back) {
      return setFileErrors((p) => ({
        ...p,
        backSideImage: "Back image is required",
      }));
    }

    const formData = new FormData();

    //// formate data.
    Object.entries(data).forEach(([key, value]) => {
      if (value && typeof value === "object") {
        Object.entries(value).forEach(([subKey, subVal]) =>
          formData.append(`${key}[${subKey}]`, subVal),
        );
      } else {
        formData.append(key, value);
      }
    });
    if (files.frontSideImage)
      formData.append("frontSideImage", files.frontSideImage);
    if (files.backSideImage)
      formData.append("backSideImage", files.backSideImage);

    setSubmitting(true);
    try {
      /// send Api Request
      const response = await sendApiRequest(() =>
        isRejected ? resubmitVendorKyc(formData) : submitVendorKyc(formData),
      );

      if (!response) return;

      dismissToast();
      showSuccess(
        response.message ||
          (isRejected
            ? "KYC resubmitted successfully."
            : "KYC submitted successfully."),
      );

      await init();
    } finally {
      setSubmitting(false);
    }
  };

  const submitButtonLabel = () => {
    if (submitting) return isRejected ? "Resubmitting…" : "Submitting…";
    if (isPending) return "Verification In Progress";
    if (isApproved) return "KYC Approved";
    if (isRejected) return "Resubmit KYC";
    return "Submit KYC";
  };

  const submitButtonIcon = () => {
    if (submitting) return <Loader size="sm" />;
    if (isApproved) return <ShieldCheck size={18} />;
    if (isPending) return <Clock size={18} />;
    if (isRejected) return <RefreshCcw size={18} />;
    return <ShieldCheck size={18} />;
  };

  if (localLoading || loading) {
    return <Loader />;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-5xl mx-auto p-4 md:p-8"
    >
      <KycImageModal
        isOpen={previewModal.open}
        src={previewModal.src}
        onClose={() => setPreviewModal({ open: false, src: "" })}
      />

      <header>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Vendor KYC Verification
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Verify your identity to enable payouts and unlock all marketplace
          features.
        </p>
      </header>

      <KycStatusBanner status={currentStatus} />
      <KycProgressTimeline
        status={currentStatus}
        record={vendorKyc || vendorKycStatus}
      />

      {isRejected && (
        <KycRejectionCard
          reason={
            vendorKyc?.rejectionReason || vendorKycStatus?.rejectionReason
          }
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PERSONAL INFORMATION */}
        <section className="bg-card border border-border rounded-2xl shadow-md p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-primary border-b border-border pb-3">
            <User size={16} /> Personal Information
          </div>
          <Input
            label="Full Name"
            {...register("fullName")}
            disabled={!isEditable}
            error={errors.fullName?.message}
          />
          <Input
            label="NID Number"
            {...register("nidNumber")}
            disabled={!isEditable}
            error={errors.nidNumber?.message}
          />
          <Input
            label="PAN Number"
            {...register("panNumber")}
            disabled={!isEditable}
            error={errors.panNumber?.message}
          />
        </section>

        {/* CITIZENSHIP DETAILS */}
        <section className="bg-card border border-border rounded-2xl shadow-md p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-primary border-b border-border pb-3">
            <FileText size={16} /> Citizenship Details
          </div>
          <Input
            label="Citizenship Number"
            {...register("citizenship.number")}
            disabled={!isEditable}
            error={errors.citizenship?.number?.message}
          />
          <Input
            label="Date of Birth"
            type="date"
            {...register("citizenship.dateOfBirth")}
            disabled={!isEditable}
            error={errors.citizenship?.dateOfBirth?.message}
          />
        </section>

        {/* BANK INFORMATION */}
        <section className="md:col-span-2 bg-card border border-border rounded-2xl shadow-md p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-primary border-b border-border pb-3">
            <Landmark size={16} /> Bank Information
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Account Holder"
              {...register("bankDetails.accountHolderName")}
              disabled={!isEditable}
              error={errors.bankDetails?.accountHolderName?.message}
            />
            <Input
              label="Account Number"
              {...register("bankDetails.accountNumber")}
              disabled={!isEditable}
              error={errors.bankDetails?.accountNumber?.message}
            />
            <Input
              label="Bank Name"
              {...register("bankDetails.bankName")}
              disabled={!isEditable}
              error={errors.bankDetails?.bankName?.message}
            />
            <Input
              label="Branch Name"
              {...register("bankDetails.branchName")}
              disabled={!isEditable}
              error={errors.bankDetails?.branchName?.message}
            />
          </div>
        </section>

        {/* DOCUMENT UPLOAD */}
        <section className="md:col-span-2 bg-card border border-border rounded-2xl shadow-md p-6">
          <div className="flex items-center gap-2 text-sm font-bold text-primary border-b border-border pb-3 mb-6">
            <Upload size={16} /> Document Upload
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <KycFileUploader
              label="Front Citizenship Image"
              previewUrl={previews.front}
              onFileChange={(e) => handleFileChange(e, "frontSideImage")}
              disabled={!isEditable}
              error={fileErrors.frontSideImage}
              onPreviewClick={() =>
                setPreviewModal({ open: true, src: previews.front })
              }
            />
            <KycFileUploader
              label="Back Citizenship Image"
              previewUrl={previews.back}
              onFileChange={(e) => handleFileChange(e, "backSideImage")}
              disabled={!isEditable}
              error={fileErrors.backSideImage}
              onPreviewClick={() =>
                setPreviewModal({ open: true, src: previews.back })
              }
            />
          </div>
        </section>
      </div>

      <div className="flex justify-end pt-2 pb-6">
        <Button
          type="submit"
          disabled={!isEditable || submitting}
          className="min-w-[200px]"
        >
          <span className="flex items-center justify-center gap-2">
            {submitButtonIcon()}
            {submitButtonLabel()}
          </span>
        </Button>
      </div>
    </form>
  );
};

export default KycVerifiaction;
