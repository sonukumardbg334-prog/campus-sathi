import React, { useState, useRef } from 'react';
import { Camera, UploadCloud, X, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from './Button';

interface PhotoUploadProps {
  label?: string;
  helperText?: string;
  value?: string;
  onChange: (url: string | undefined) => void;
  maxSizeMb?: number;
  captureMode?: boolean;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  label = 'Upload Photo Evidence',
  helperText = 'Attach photo of the problem (PNG, JPG, WebP up to 5MB)',
  value,
  onChange,
  maxSizeMb = 5,
  captureMode = true,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = (file: File) => {
    setError(null);

    // Validate type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (PNG, JPG, or WebP)');
      return;
    }

    // Validate size
    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(`File size exceeds maximum permitted limit (${maxSizeMb}MB)`);
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = () => {
      setIsProcessing(false);
      onChange(reader.result as string);
    };
    reader.onerror = () => {
      setIsProcessing(false);
      setError('Failed reading image file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleRemove = () => {
    onChange(undefined);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <div className="w-full">
      {label && <label className="block text-xs font-semibold text-[var(--page-foreground)] mb-1.5">{label}</label>}

      {value ? (
        <div className="relative rounded-xl border border-[var(--card-border)] overflow-hidden bg-[var(--nested-surface)] group">
          <img
            src={value}
            alt="Evidence preview"
            className="w-full h-48 object-cover transition-transform group-hover:scale-[1.01]"
          />
          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              onClick={() => fileInputRef.current?.click()}
            >
              Replace
            </Button>
            <Button
              type="button"
              size="sm"
              variant="danger"
              leftIcon={<X className="w-3.5 h-3.5" />}
              onClick={handleRemove}
            >
              Remove
            </Button>
          </div>
          <div className="p-2.5 bg-[var(--card-background)] border-t border-[var(--card-border)] flex items-center justify-between text-xs text-muted">
            <span className="font-medium text-teal-brand flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-brand animate-pulse"></span>
              Photo Evidence Ready
            </span>
            <button
              type="button"
              onClick={handleRemove}
              className="text-danger hover:underline font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-[var(--card-border)] rounded-xl p-5 text-center bg-[var(--nested-surface)] hover:bg-[var(--card-background)] transition-colors">
          <div className="flex justify-center gap-2 mb-2">
            <div className="p-2.5 bg-primary/5 rounded-full text-primary">
              <UploadCloud className="w-6 h-6" />
            </div>
            {captureMode && (
              <div className="p-2.5 bg-teal-brand/10 rounded-full text-teal-brand sm:hidden">
                <Camera className="w-6 h-6" />
              </div>
            )}
          </div>

          <p className="text-xs font-semibold text-foreground">Click to upload photo evidence</p>
          <p className="text-[11px] text-muted mt-0.5">{helperText}</p>

          <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              leftIcon={<UploadCloud className="w-3.5 h-3.5" />}
              onClick={() => fileInputRef.current?.click()}
              isLoading={isProcessing}
            >
              Choose File
            </Button>

            {captureMode && (
              <Button
                type="button"
                size="sm"
                variant="teal"
                leftIcon={<Camera className="w-3.5 h-3.5" />}
                onClick={() => cameraInputRef.current?.click()}
                isLoading={isProcessing}
              >
                Use Camera
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Hidden standard file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInputChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />

      {/* Hidden camera capture input for mobile browsers */}
      <input
        type="file"
        ref={cameraInputRef}
        onChange={handleInputChange}
        accept="image/*"
        capture="environment"
        className="hidden"
      />

      {error && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-danger font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

