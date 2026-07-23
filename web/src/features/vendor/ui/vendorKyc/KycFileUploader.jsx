


import { Upload, Camera } from 'lucide-react';

const KycFileUploader = ({ label, onFileChange, previewUrl, disabled, error, onPreviewClick }) => (
  <div className="space-y-2 w-full">
    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</label>
    <div
      onClick={() => previewUrl && disabled && onPreviewClick?.()}
      className={`relative group h-44 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all overflow-hidden
        ${previewUrl ? 'border-primary/40 bg-primary/5' : 'border-border bg-background'}
        ${disabled ? (previewUrl ? 'cursor-pointer' : 'cursor-default') + ' opacity-90' : 'cursor-pointer hover:border-primary/50'}`}
    >
      {previewUrl ? (
        <>
          <img src={previewUrl} alt={label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="text-white" size={22} />
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center text-center px-4">
          <Upload size={22} className="text-muted-foreground mb-2" />
          <p className="text-[11px] font-semibold text-muted-foreground uppercase">Upload {label}</p>
        </div>
      )}
      {!disabled && (
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      )}
    </div>
    {error && <p className="text-[11px] text-danger font-medium">{error}</p>}
  </div>
);

export default KycFileUploader;
