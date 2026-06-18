/**
 * Reusable form field component with validation display.
 * Reduces duplication across AuthPage and other forms.
 */
import React from 'react';
import { ValidationResult } from '../utils/validation';

interface FormFieldProps {
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select';
  value: string | number;
  onChange: (value: string | number) => void;
  validation: ValidationResult | null;
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  aria-label?: string;
}

export const FormField = React.memo(({
  label,
  type,
  value,
  onChange,
  validation,
  placeholder,
  options,
  required = true,
  disabled = false,
  autoComplete,
  'aria-label': ariaLabel,
}: FormFieldProps) => {
  const hasError = validation && !validation.valid;

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {type === 'select' ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            hasError
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-green-500'
          }`}
          aria-label={ariaLabel}
        >
          <option value="">{placeholder || 'Select...'}</option>
          {options?.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(type === 'number' ? parseFloat(e.target.value) : e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-label={ariaLabel}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            hasError
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-green-500'
          }`}
        />
      )}
      
      {hasError && (
        <p className="mt-1 text-sm text-red-500" role="alert">
          {validation.error}
        </p>
      )}
    </div>
  );
});

FormField.displayName = 'FormField';
