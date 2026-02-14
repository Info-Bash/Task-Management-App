
import { forwardRef, SelectHTMLAttributes, ReactNode } from "react";

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];      // Array of options
  error?: string;         // Validation error
  tooltip?: string;       // Optional tooltip
  children?: ReactNode;   // Rare, optional
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, options, error, tooltip, children, ...props }, ref) => (
    <div className="col-md-6 text-start position-relative">
      <label className="form-label fw-bold">{label}</label>
      <div className="input-group has-validation">
        <select
          ref={ref}
          className={`form-select py-2 ${error ? "is-invalid" : ""}`}
          {...props}
        >
          <option value="" disabled>
            Choose...
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
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


SelectField.displayName = "SelectField";
