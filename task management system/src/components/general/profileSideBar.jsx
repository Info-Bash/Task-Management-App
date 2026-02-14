import { useState, useEffect, useRef } from 'react';
import ProfileField from './profile';
import { REGISRULES } from '../../schemas/schemasRules';
import { useFormHandler } from "../../hooks/useFormHandler";
import { useFormValidation } from "../../hooks/useFormValidation";
import { editProfileSchema } from '../../schemas/editProfile.schema';

const ProfileSidebar = ({ show, handleClose, user, onSave, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const containerRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const [updateStatus, setUpdateStatus] = useState("");


  useEffect(() => {
    if (show) {
      setFormData(user || {});
      setErrors({});
      setTouched({});
    }
  }, [show, user]);

  useEffect(() => {
    if (!updateMessage) return;

    const timer = setTimeout(() => {
      setUpdateMessage("");
      setUpdateStatus("");
    }, 3000);
    return () => clearTimeout(timer);
  }, [updateMessage]);


  const { validateField } = useFormValidation(
    editProfileSchema,
    setErrors
  );

  const { handleChange, handleBlur } = useFormHandler(
    setFormData,
    touched,
    setTouched,
    validateField
  );

  // Handle Cancel specifically
  const handleCancel = () => {
    setIsEditing(false);
    setFormData(user || {});
    setErrors({});
    setTouched({});
  };


  const handleSaveClick = async () => {
  // Mark all fields touched
  const allTouched = Object.keys(formData).reduce((acc, key) => {
    acc[key] = true;
    return acc;
  }, {});
  setTouched(allTouched);

  // Fix types before validation
  const parsedData = { ...formData, age: Number(formData.age) };

  // Validate client-side 
  const result = editProfileSchema.safeParse(parsedData);

  if (!result.success) {
    const newErrors = {};
    result.error.issues.forEach(issue => {
      const field = issue.path[0];
      newErrors[field] = issue.message;
    });

    setErrors(newErrors);

    // Focus first invalid field
    const firstField = result.error.issues[0].path[0];
    containerRef.current?.querySelector(`[name="${firstField}"]`)?.focus();
    return;
  }

  // Call API
  setUpdateLoading(true);
  setUpdateMessage("");
  setUpdateStatus("");

  try {
    const response = await onSave(parsedData);

    if (response.success) {
      setIsEditing(false);
      setUpdateStatus("success");
      setUpdateMessage(response.message);
    } else {
      setUpdateStatus("error");
      setUpdateMessage(response.message || "Failed to update profile");
    }
  } catch (e) {
    const backendErrors = e.response?.data?.errors;

    if (backendErrors) {
      setErrors(backendErrors);

      const firstField = Object.keys(backendErrors)[0];
      const fieldEl = containerRef.current?.querySelector(`[name="${firstField}"]`);
      fieldEl?.focus();
      fieldEl?.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    setUpdateStatus("error");
    setUpdateMessage(
      e.response?.data?.message || e.message || "Server unreachable"
    );
  } finally {
    setUpdateLoading(false);
  }
};



  return (
    <div className={`offcanvas offcanvas-end ${show ? 'show' : ''}`}
      style={{ visibility: show ? 'visible' : 'hidden' }} tabIndex="-1">

      <div className="offcanvas-header bg-primary text-white">
        <h5 className="offcanvas-title">User Profile</h5>
        <button type="button" className="btn-close btn-close-white" onClick={handleClose}></button>
      </div>

      <div ref={containerRef} className="offcanvas-body">
        <div className="text-center mb-4">
          <img src="/images/profile-icon-isolated-on-grey-260nw-1642562347.webp"
            className="rounded-circle border" width="100" height="100" alt="Profile" />
          <h4 className="mt-2">{user ? user.fullname || 'User' : 'User'}</h4>
          <span className="badge bg-light text-dark">{user ? user.role || 'Unknown' : 'Unknown'}</span>
        </div>

        <div className="profile-details">
          {/* EDITABLE FIELDS */}
          <ProfileField
            label="Full Name"
            name="fullname"
            isEditing={isEditing}
            formData={formData}
            handleChange={handleChange}
            handleBlur={handleBlur}
            error={errors.fullname}
          />

          <ProfileField
            label="Phone Number"
            name="phonenumber"
            isEditing={isEditing}
            formData={formData}
            handleChange={handleChange}
            handleBlur={handleBlur}
            error={errors.phonenumber}
          />

          <div className="row">
            <div className="col-6">
              <ProfileField
                label="Age"
                name="age"
                isEditing={isEditing}
                formData={formData}
                handleChange={handleChange}
                handleBlur={handleBlur}
                error={errors.age}
              />
            </div>
            <div className="col-6">
              <ProfileField
                label="Marital Status"
                name="maritalstatus"
                isEditing={isEditing}
                formData={formData}
                handleChange={handleChange}
                handleBlur={handleBlur}
                options={REGISRULES.MARITAL_STATUS.status}
                type="select"
                error={errors.maritalstatus}
              />
            </div>
          </div>


          {/* READ ONLY FIELD */}
          <ProfileField label="Username" name="username" isEditing={isEditing} formData={formData} readOnly={true} />

          <ProfileField label="Email Address" name="email" isEditing={isEditing} formData={formData} readOnly={true} />

          <ProfileField label="Gender" name="gender" isEditing={isEditing} formData={formData} readOnly={true} />

          <ProfileField label="National ID" name="nationalid" isEditing={isEditing} formData={formData} readOnly={true} />

        </div>

        {/* Server response message */}
        {updateMessage && (
          <div
            className={`alert d-flex align-items-center p-2 mt-3 shadow-sm border-0 rounded-3 ${updateStatus === "success" ? "alert-success" : "alert-danger"
              }`}
            role="alert"
          >
            <i
              className={`bi me-2 ${updateStatus === "success"
                ? "bi-check-circle-fill"
                : "bi-exclamation-triangle-fill"
                }`}
            ></i>

            <div className="small fw-bold">{updateMessage}</div>
          </div>
        )}


        <div className="d-grid gap-2 mt-4">
          {isEditing ? (
            <>
              <button className={`btn btn-success ${updateLoading ? 'disabled' : ''}`} onClick={handleSaveClick}>
                {updateLoading ?
                  <>
                    <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                    <span className="visually-hidden" role="status">Loading...</span>
                  </> :
                  "Submit Changes"}
              </button>
              <button className="btn btn-light" onClick={handleCancel}>Cancel</button>
            </>
          ) : (
            <button className="btn btn-outline-primary" onClick={() => setIsEditing(true)}>Edit Profile</button>
          )}
          <button className="btn btn-danger mt-2 mb-3" onClick={onLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;