
import { forwardRef, ForwardedRef, InputHTMLAttributes, ReactNode } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  tooltip?: string;
  error?: string;
  children?: ReactNode;
  fullWidth?: boolean;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, tooltip, error, children, fullWidth, ...props }, ref: ForwardedRef<HTMLInputElement>) => (
    <div className={`${fullWidth ? 'w-100' : 'col-md-6'} text-start position-relative`}>
      <label className="form-label fw-bold">{label}</label>
      <div className="input-group has-validation">
        <input
          ref={ref}              // Optional, can keep for focus control
          className={`form-control py-2 ${error ? "is-invalid" : ""}`}
          {...props}             // Must include `value` + `onChange` from parent
        />
        {children}
        {error ? (
          <div className="invalid-feedback">{error}</div>
        ) : tooltip ? (
          <div className="invalid-tooltip">{tooltip}</div>
        ) : null}
      </div>
    </div>
  )
);

InputField.displayName = "InputField";