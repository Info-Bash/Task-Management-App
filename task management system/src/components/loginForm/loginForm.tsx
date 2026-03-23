import { useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import { authSchema } from '../../schemas/auth.schema';
import { handleKeyDown } from '../../hooks/handleKeyDown';
import { useFormHandler } from '../../hooks/useFormHandler';
import { useFormValidation } from '../../hooks/useFormValidation';
import { InputField } from '../registrationForm/formInputField';
import { useAuth } from '../../hooks/useAuth';

interface LoginResponse {
  accessToken: string;
}

export function LoginForm() {

  const formRef = useRef<HTMLFormElement | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitLoading, isSetSubmitLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const location = useLocation();
  const from = location.state?.from?.pathname;

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const { validateField } = useFormValidation(
    authSchema,
    setErrors
  );


  const { handleChange, handleBlur } = useFormHandler(
    setFormData,
    touched,
    setTouched,
    validateField
  );

  const navigate = useNavigate();

  // Type-safe submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);


    const result = authSchema.safeParse(formData);

    // CLIENT-SIDE VALIDATION
    if (!result.success) {
      const firstIssue = result.error.issues[0];
      const field = firstIssue.path[0] as keyof typeof formData;

      setErrors((prev) => ({
        ...prev,
        [field]: firstIssue.message,
      }));

      formRef.current
        ?.querySelector<HTMLInputElement>(`[name="${field}"]`)
        ?.focus();

      return;
    }

    // Authentication logic Api

    try {
      isSetSubmitLoading(true);
      
      await login(formData, from);

      // Reset form input fields and errors
      setFormData({
        email: "",
        password: ""
      });

      setErrors({});
      setTouched({});

    } catch (e: unknown) {

      if (axios.isAxiosError(e)) {
        // message from backend OR fallback
        setAuthError(e.response?.data?.message || "Login failed");
      } else {
        setAuthError("Something went wrong. Try again.");
      }

    } finally {
      isSetSubmitLoading(false);
    }

  };

  return (
    <div className="col-lg-8 d-flex align-items-center bg-white p-4 p-md-5">
      <div className="w-100">
        <div className="text-center text-lg-start mb-4">
          <h2 className="fw-bold mb-1">Welcome Back</h2>
          <p className="text-muted">Enter your credentials to access your account.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          onKeyDown={(e) => handleKeyDown(formRef, e)}
          ref={formRef}>

          {/* Email Field */}
          <InputField
            label="Email Address"
            type="email"
            name="email"
            placeholder="name@company.com"
            value={formData.email}
            onChange={handleChange("email", (val) => val.replace(/\s+/g, ""))}
            onBlur={() => handleBlur("email", formData.email)}
            error={errors.email}
            fullWidth
          />

          {/* Password Field */}
          <InputField
            label="Password"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange("password")}
            onBlur={() => handleBlur("password", formData.password)}
            error={errors.password}
            fullWidth
          >
            {/* Password Toggle Button */}
            <button
              type="button"
              className="btn btn-outline-secondary px-3"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
            </button>
          </InputField>


          <div className="mt-2 mb-4 form-check">
            <input type="checkbox" className="form-check-input" id="remember" />
            <label className="form-check-label small text-muted" htmlFor="remember">
              Keep me logged in
            </label>
          </div>

          {/* Server / login error */}
          {authError && (
            <div className="alert alert-danger d-flex align-items-center p-2 mt-3 shadow-sm border-0 rounded-3" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>

              <div className="small fw-bold">
                {authError}
              </div>
            </div>
          )}

          <button type="submit" className={`btn btn-primary w-100 mb-3 fw-bold shadow-sm text-uppercase ${isSubmitLoading ? 'disabled' : ''}`}>
            {
              isSubmitLoading ?
                <>
                  <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                  <span className="visually-hidden" role="status">Loading...</span>
                </>
                :
                `Login`
            }
          </button>

          <p className="d-lg-none text-center small text-muted">
            Don’t have an account?{" "}
            <Link to={"/register"} className="text-decoration-none fw-semibold">
              Sign up
            </Link>
          </p>

        </form>

        {/* Divider */}
        <div className="d-flex align-items-center my-4">
          <hr className="flex-grow-1 text-muted" />
          <span className="mx-3 text-muted small">OR</span>
          <hr className="flex-grow-1 text-muted" />
        </div>

        {/* Social Buttons */}
        <div className="row g-2">
          <div className="col-6">
            <button className="btn btn-outline-light border text-dark w-100 py-2 d-flex align-items-center justify-content-center">
              Google
            </button>
          </div>
          <div className="col-6">
            <button className="btn btn-outline-light border text-dark w-100 py-2 d-flex align-items-center justify-content-center">
              GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}