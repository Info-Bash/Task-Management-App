import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../api/api";
import { AxiosError } from "axios";
import { registrationSchema } from "../../schemas/registration.schema";
import { handleKeyDown } from "../../hooks/handleKeyDown";
import { useFormHandler } from "../../hooks/useFormHandler";
import { useFormValidation } from "../../hooks/useFormValidation";
import { AllFormField } from "./allFormField";


export function RegistrationForm() {

  interface BackendErrorResponse {
    message?: string;
    errors?: Record<string, string>;
  }

  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitLoading, isSetSubmitLoading] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [isFormError, setIsFormError] = useState(false);
  const formMessageRef = useRef<HTMLDivElement | null>(null);


  useEffect(() => {
    if (formMessageRef.current) {
      formMessageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [formMessage]);



  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    age: "",
    nationalid: "",
    phonenumber: "",
    email: "",
    gender: "",
    maritalstatus: "",
    password: "",
    confirmPassword: "",
  });



  const { validateField } = useFormValidation(
    registrationSchema,
    setErrors
  );


  const { handleChange, handleBlur } = useFormHandler(
    setFormData,
    touched,
    setTouched,
    validateField
  );


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    isSetSubmitLoading(true);
    setFormMessage(null);
    setIsFormError(false);

    const parsedData = {
      ...formData,
      age: Number(formData.age),
    };

    const result = registrationSchema.safeParse(parsedData);

    // CLIENT-SIDE VALIDATION
    if (!result.success) {
      const firstIssue = result.error.issues[0];
      const field = firstIssue.path[0] as keyof typeof formData;

      setErrors((prev) => ({
        ...prev,
        [field]: firstIssue.message,
      }));

      const firstInvalidField =
        formRef.current?.querySelector<HTMLInputElement | HTMLSelectElement>(
          `[name="${field}"]`
        );

      if (firstInvalidField) {
        firstInvalidField.focus();
        firstInvalidField.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      isSetSubmitLoading(false);
      return;
    }

    // Clear client errors before API
    setErrors({});

    //API CALL
    try {
      const res = await API.post("/registration", formData,
        { headers: { "Content-Type": "application/json" } }
      );

      setIsFormError(false);
      setFormMessage(res.data.message); // success message

      // Reset form input fields and errors
      setFormData({
        fullname: "",
        username: "",
        age: "",
        nationalid: "",
        phonenumber: "",
        email: "",
        gender: "",
        maritalstatus: "",
        password: "",
        confirmPassword: "",
      });

      setErrors({});
      setTouched({});

    } catch (err) {
      const axiosErr = err as AxiosError<BackendErrorResponse>;

      if (!axiosErr.response) {
        // Network-level error
        setFormMessage("Server unreachable. Please try again later.");
        setIsFormError(true);
        return;
      }

      const backendErrors = axiosErr.response?.data?.errors;

      // Only show top-level message if there are NO field-specific errors
      setFormMessage(
        backendErrors ? null : axiosErr.response?.data?.message || null
      );
      setIsFormError(!!axiosErr.response?.data?.message || !!backendErrors);

      // Map field-specific errors
      if (backendErrors) {
        setErrors(backendErrors);

        // Focus and scroll first invalid field
        const firstField = Object.keys(backendErrors)[0];
        const fieldEl =
          formRef.current?.querySelector<HTMLInputElement | HTMLSelectElement>(
            `[name="${firstField}"]`
          );

        fieldEl?.focus();
        fieldEl?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } finally {
      isSetSubmitLoading(false);
    }

  };




  return (

    <div className="col-lg-8 right-panel p-4 p-md-5 bg-white">
      {formMessage && (
        <div
          ref={formMessageRef}
          className={`mb-4 p-3 rounded d-flex align-items-center shadow-sm border ${isFormError
            ? "bg-danger-subtle text-danger-emphasis border-danger-subtle"
            : "bg-success-subtle text-success-emphasis border-success-subtle"
            }`}
          role="alert"
        >
          {/* Icon Logic */}
          <i className={`bi ${isFormError ? "bi-exclamation-octagon-fill" : "bi-check-circle-fill"} me-3 fs-5`}></i>

          <div className="flex-grow-1">
            <span className="fw-medium">{formMessage}</span>

            {/* Conditional Login Link for Success State */}
            {!isFormError && (
              <div className="mt-1">
                <span className="text-success text-decoration-underline small fw-bold">
                  <Link to={'/login'}>Click here to login <i className="bi bi-arrow-right"></i> </Link>
                </span>
              </div>
            )}
          </div>
        </div>
      )}


      <h3 className="mb-4 fw-bold text-dark text-start">Create Your Account</h3>

      <form
        ref={formRef}
        noValidate
        onKeyDown={(e) => handleKeyDown(formRef, e)}
        onSubmit={handleSubmit}
      >
        <AllFormField
          formData={formData}
          handleBlur={handleBlur}
          handleChange={handleChange}
          errors={errors}
        />

        <p className="d-lg-none text-center small mt-3 text-muted">
          Already have an account?{" "}
          <Link to={'/login'} className="text-decoration-none fw-semibold">
            Log in
          </Link>
        </p>


        <button type="submit" className={`btn btn-primary w-100 mt-5 py-2 fw-bold shadow-sm text-uppercase ${isSubmitLoading ? 'disabled' : ''}`}>
          {
            isSubmitLoading ?
              <>
                <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                <span className="visually-hidden" role="status">Loading...</span>
              </>
              :
              `Complete Registration`
          }
        </button>
      </form>
    </div>



  );
}