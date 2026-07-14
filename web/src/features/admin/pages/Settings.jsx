import { useRef, useState, useEffect } from "react";
import useAuthStore from "../../../store/authStore";
import { Save, Shield, User, Camera, Loader2 } from "lucide-react";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { useForm } from "react-hook-form";
import { forgetPasswordApi } from "../../../api/auth.api";
import { dismissToast, showSuccess } from "../../../utils/toast";
import sendApiRequest from "../../../utils/sendApiRequest";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserName } from "../../../schemas/auth.validation";

const Settings = () => {
    const { user, loading } = useAuthStore();
    const updateUserNameAction = useAuthStore((state) => state.updateUserName);
    const updateUserAvatarAction = useAuthStore((state) => state.updateUserAvatar);

  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(updateUserName),
    defaultValues: {
      userName: user?.userName || "",
    },
  });

  useEffect(() => {
    if (user?.userName) {
      reset({ userName: user.userName });
    }
  }, [user?.userName, reset]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAvatarSubmit = async () => {
    if (!selectedFile) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append("avatar", selectedFile);

    const res = await sendApiRequest(() => updateUserAvatarAction(formData));
    setIsUploading(false);

    if (!res) return;

    showSuccess("Profile picture updated successfully!");
    setSelectedFile(null);
    setPreviewUrl(null);
  };

    const onNameSubmit = async (data) => {
    const res = await sendApiRequest(() => updateUserNameAction(data));
        
    if (!res) return;

    if (res?.data?.userName) {
      reset({ userName: res.data.userName });
    }
    showSuccess("Profile name updated!");
  };

  const handleForgetFormSubmit = async () => {
    const res = await sendApiRequest(() => forgetPasswordApi({ email: user?.email }));
    if (!res) return;

    dismissToast();
    showSuccess(res.message || "Password reset link sent.");
  };
    
const displayFont = { fontFamily: "'Fraunces', Georgia, serif" };

function SectionHeading({ eyebrow, title }) {
  return (
    <div className="mb-6">
      <div>
        {eyebrow && (
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
            {eyebrow}
          </p>
        )}
        <h2 className="text-xl font-semibold tracking-tight text-[#1F2937]">
          {title}
        </h2>
      </div>
    </div>
  );
}

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <SectionHeading 
        eyebrow="Configure your personal login credentials and profile picture."
        title="Account Settings" 
      />

      <div className="bg-white p-6 rounded-2xl border border-[#DBE4EC] shadow-sm space-y-6">
        <h3 className="font-bold text-lg text-[#1F2937] border-b border-slate-50 pb-3 flex items-center gap-2">
          <User className="w-5 h-5 text-[#6A89A7]" />
          Personal Profile
        </h3>

        <div className="flex flex-col sm:flex-row items-center gap-8 pb-4">
          <div className="relative group">
            <div
              onClick={() => fileInputRef.current.click()}
              className="relative w-28 h-28 cursor-pointer overflow-hidden rounded-xl border-4 border-white shadow-md ring-1 ring-[#DBE4EC]"
            >
              {previewUrl || user?.avatar ? (
                <img
                  key={user?.avatar}
                  src={previewUrl || user?.avatar}
                  alt="Avatar Profile"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-primary flex items-center justify-center">
                  <User className="text-primary-foreground w-12 h-12" />
                </div>
              )}

              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Camera className="text-white w-6 h-6" />
                <span className="text-white text-[10px] font-medium mt-1">CHANGE</span>
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/jpg, image/webp, image/avif"
              className="hidden"
            />
          </div>

          <div className="flex flex-col items-center sm:items-start gap-3">
            <div>
              <h4 className="font-bold text-[#1F2937] text-lg">Profile Image</h4>
              <p className="text-xs text-[#64748B]">JPG, PNG, WEBP or AVIF. Max 5MB</p>
            </div>

            {selectedFile && (
              <div className="flex gap-2">
                <Button 
                  onClick={handleAvatarSubmit} 
                  disabled={isUploading} 
                  className="py-2 px-4 text-xs h-9"
                >
                  {isUploading ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : null}
                  Update Avatar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => { 
                    setSelectedFile(null); 
                    setPreviewUrl(null); 
                  }}
                  className="py-2 px-4 text-xs h-9 border-[#DBE4EC] text-gray-500"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit(onNameSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Full Name" 
              {...register("userName")} 
              error={errors.userName?.message} 
              type="text" 
            />
            <Input 
              label="Email Address" 
              value={user?.email ?? ""} 
              type="email" 
              disabled 
            />
            <Input 
              label="Phone Number" 
              value={user?.mobile ?? ""} 
              type="tel" 
              disabled 
            />
          </div>
          <div className="flex justify-end pt-4 border-t border-slate-50">
            <Button 
              type="submit" 
              disabled={loading} 
              icon={Save} 
              iconPosition="left" 
              iconsize={18}
            >
              {loading ? "Saving Name..." : "Save Name Change"}
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-[#DBE4EC] shadow-sm space-y-6">
        <h3 className="font-bold text-lg text-[#1F2937] border-b border-slate-50 pb-3 flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#6A89A7]" />
          Security Credentials
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-center">
          <Input 
            label="Current Password" 
            value="••••••••" 
            type="password" 
            disabled 
          />
          <Button 
            type="button" 
            className="cursor-pointer whitespace-nowrap" 
            onClick={handleForgetFormSubmit}
          >
            Reset Password
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;