import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-[var(--page-foreground)] mb-1.5">
            {label} {props.required && <span className="text-danger">*</span>}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={twMerge(
            clsx(
              'w-full px-3.5 py-2.5 bg-[var(--input-background)] text-sm text-[var(--input-foreground)] border border-[var(--card-border)] rounded-xl transition-all placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400 backdrop-blur-md',
              error ? 'border-danger focus:ring-danger/20 focus:border-danger' : '',
              className
            )
          )}
          {...props}
        />
        {helperText && !error && <p className="mt-1 text-xs text-[var(--muted-foreground)]">{helperText}</p>}
        {error && <p className="mt-1 text-xs font-medium text-danger">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, rows = 3, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-[var(--page-foreground)] mb-1.5">
            {label} {props.required && <span className="text-danger">*</span>}
          </label>
        )}
        <textarea
          id={inputId}
          ref={ref}
          rows={rows}
          className={twMerge(
            clsx(
              'w-full px-3.5 py-2.5 bg-[var(--input-background)] text-sm text-[var(--input-foreground)] border border-[var(--card-border)] rounded-xl transition-all placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400 backdrop-blur-md',
              error ? 'border-danger focus:ring-danger/20 focus:border-danger' : '',
              className
            )
          )}
          {...props}
        />
        {helperText && !error && <p className="mt-1 text-xs text-[var(--muted-foreground)]">{helperText}</p>}
        {error && <p className="mt-1 text-xs font-medium text-danger">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, children, options, id, ...props }, ref) => {
    const selectId = id || props.name;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-semibold text-[var(--page-foreground)] mb-1.5">
            {label} {props.required && <span className="text-danger">*</span>}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={twMerge(
            clsx(
              'w-full px-3.5 py-2.5 bg-[var(--input-background)] text-sm text-[var(--input-foreground)] border border-[var(--card-border)] rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400 backdrop-blur-md cursor-pointer',
              error ? 'border-danger focus:ring-danger/20 focus:border-danger' : '',
              className
            )
          )}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        {error && <p className="mt-1 text-xs font-medium text-danger">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';
