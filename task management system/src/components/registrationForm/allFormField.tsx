import { useState } from "react";
import { InputField } from "./formInputField";
import { SelectField } from "./formSelectField";
import { REGISRULES } from "../../schemas/schemasRules";


type FormData = {
  fullname: string;
  username: string;
  age: string;
  nationalid: string;
  phonenumber: string;
  email: string;
  gender: string;
  maritalstatus: string;
  password: string;
  confirmPassword: string;
};

interface AllFormFieldProps {
  formData: FormData;
  handleChange: <T extends HTMLInputElement | HTMLSelectElement>(
    field: keyof FormData,
    sanitize?: (val: string) => string
  ) => (e: React.ChangeEvent<T>) => void;
  handleBlur: (field: keyof FormData, value: unknown) => void;
  errors: Partial<Record<keyof FormData, string>>;
}

export function  AllFormField ({formData, handleBlur, handleChange,errors}:AllFormFieldProps) {
  

  const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="row g-4">

      {/* Full Name */}
      <InputField
        label="Full name"
        name="fullname"
        type="text"
        value={formData.fullname}
        onChange={handleChange("fullname")}
        error={errors.fullname}
        placeholder="e.g. Abubakar Babatunde E"
        onBlur={() => handleBlur("fullname", formData.fullname)}
      />

      {/* Username */}
      <InputField
        label="Username"
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange("username", (val) => val.replace(/\s+/g, ""))}
        error={errors.username}
        placeholder="user_name123"
        onBlur={() => handleBlur("username", formData.username)}
      />

      {/* Age */}
      <InputField
        label="Age"
        type="text"
        name="age"
        value={formData.age}
        onChange={handleChange("age", (val) => val.replace(/\D/g, ""))}
        placeholder={`${REGISRULES.AGE.min} - ${REGISRULES.AGE.max}`}
        onBlur={() => handleBlur("age", formData.age)}
        error={errors.age}
      />

      {/* National ID */}
      <InputField
        label="National ID"
        type="text"
        name="nationalid"
        value={formData.nationalid}
        onChange={handleChange("nationalid", (val) => val.replace(/[^a-zA-Z0-9]/g, ""))}
        placeholder="e.g. ABC12345678"
        onBlur={() => handleBlur("nationalid", formData.nationalid)}
        error={errors.nationalid}
      />

      {/* Phone Number */}
      <InputField
        label="Phone Number"
        type="text"
        name="phonenumber"
        value={formData.phonenumber}
        onChange={handleChange("phonenumber", (val) => val.replace(/\D/g, ""))}
        placeholder="08012345678"
        onBlur={() => handleBlur("phonenumber", formData.phonenumber)}
        error={errors.phonenumber}
      />

      {/* Email */}
      <InputField
        label="Email Address"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange("email", (val) => val.replace(/\s+/g, ""))}
        placeholder="name@email.com"
        onBlur={() => handleBlur("email", formData.email)}
        error={errors.email}
      />

      {/* Gender */}
      <SelectField
        label="Gender"
        name="gender"
        options={REGISRULES.GENDER.sex}
        value={formData.gender}
        onChange={handleChange("gender")}

        onBlur={() => handleBlur("gender", formData.gender)}
        error={errors.gender}
      />

      {/* Marital Status */}
      <SelectField
        label="Marital Status"
        name="maritalstatus"
        options={REGISRULES.MARITAL_STATUS.status}
        value={formData.maritalstatus}
        onChange={handleChange("maritalstatus")}
        onBlur={() => handleBlur("maritalstatus", formData.maritalstatus)}
        error={errors.maritalstatus}
      />

      {/* Password 1 */}
      <InputField
        label="Password"
        name="password"
        type={showPassword ? "text" : "password"}
        placeholder="••••••••"
        value={formData.password}
        onChange={handleChange("password")}
        onBlur={() => handleBlur("password", formData.password)}
        error={errors.password}
      > <button
        type="button"
        className="btn btn-outline-secondary px-3"
        onClick={() => setShowPassword(!showPassword)}
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
          <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
        </button>
      </InputField>

      {/* Password 2 (Confirm) */}
      <InputField
        label="Confirm Password"
        name="confirmPassword"
        placeholder="••••••••"
        type={showConfirmPassword ? "text" : "password"}
        value={formData.confirmPassword}
        onChange={handleChange("confirmPassword")}
        onBlur={() => handleBlur("confirmPassword", formData.confirmPassword)}
        error={errors.confirmPassword}
      >
        <button
          type="button"
          className="btn btn-outline-secondary px-3"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
        </button>
      </InputField>

    </div>
  );
}