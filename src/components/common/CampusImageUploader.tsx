import React, { useState, useRef } from 'react';
import { UploadCloud, X, RefreshCw, AlertCircle, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { Button } from '../ui/Button';

export interface CampusImageUploaderProps {
  label: string;
  helperText?: string;
  value?: string;
  onChange: (url: string | undefined) => void;
  maxSizeMb?: number;
  aspectRatio?: 'hero' | 'logo' | 'square';
  placeholderText?: string;
  required?: boolean;
}

export const CampusImageUploader: React.FC<CampusImageUploaderProps> = ({
  label,
  helperText = 'JPG, PNG, or WebP up to 5MB',
  value,
  onChange,
  maxSizeMb = 5,
  aspectRatio = 'hero',
  placeholderText = 'Drag & drop image or browse files',
  required = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

  const validateAndProcessFile = (file: File) => {
    setError(null);

    // Validate MIME type
    if (!allowedMimeTypes.includes(file.type)) {
      setError('Invalid file format. Please upload a JPG, PNG, or WebP image.');
      return;
    }

    // Validate size
    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(`File size exceeds maximum permitted limit (${maxSizeMb}MB).`);
      return;
    }

    // Simulate upload progress
    setUploadProgress(15);
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null || prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 25;
      });
    }, 120);

    const reader = new FileReader();
    reader.onload = () => {
      clearInterval(progressInterval);
      setUploadProgress(100);
      setTimeout(() => {
        setUploadProgress(null);
        onChange(reader.result as string);
      }, 300);
    };

    reader.onerror = () => {
      clearInterval(progressInterval);
      setUploadProgress(null);
      setError('Failed reading image file. Please try again.');
    };

    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndProcessFile(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndProcessFile(file);
    }
  };

  const handleRemove = () => {
    onChange(undefined);
    setError(null);
    setUploadProgress(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const aspectStyles = {
    hero: 'h-48 sm:h-56',
    logo: 'h-32 sm:h-36',
    square: 'h-40 sm:h-40 w-40 sm:w-40 mx-auto',
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-[var(--page-foreground)]">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {helperText && <span className="text-[11px] text-[var(--muted-foreground)]">{helperText}</span>}
      </div>

      {error && (
        <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/40 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {uploadProgress !== null && (
        <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40 space-y-1.5 animate-pulse">
          <div className="flex justify-between text-xs text-blue-700 dark:text-blue-300 font-medium">
            <span>Uploading & processing image...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full h-1.5 bg-blue-200 dark:bg-blue-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-200"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {value ? (
        <div className={`relative rounded-2xl border border-[var(--card-border)] overflow-hidden bg-slate-900 group shadow-md ${aspectStyles[aspectRatio]}`}>
          <img
            src={value}
            alt={label}
            className="w-full h-full object-cover object-center transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
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
          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] backdrop-blur-xs flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Image Ready
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-6 text-center ${
            isDragging
              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 scale-[1.01]'
              : 'border-[var(--card-border)] hover:border-blue-400 bg-[var(--nested-surface)] hover:bg-[var(--card-background)]'
          } ${aspectStyles[aspectRatio]}`}
        >
          <div className="w-12 h-12 rounded-2xl bg-[var(--card-background)] shadow-sm flex items-center justify-center text-blue-600 dark:text-cyan-400 mb-2 border border-[var(--card-border)]">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-xs font-semibold text-[var(--card-foreground)]">{placeholderText}</p>
          <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">Click or drag file here</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
};

