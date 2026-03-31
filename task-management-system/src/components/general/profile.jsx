
const ProfileField = ({
  label,
  name,
  isEditing,
  formData,
  handleBlur,
  handleChange,
  type = "text",
  options,
  readOnly = false,
  error
}) => {
  return (
    <div className="mb-3">
      <label className="small text-muted">{label}</label>

      {isEditing && !readOnly ? (
        <>
          {type === "select" ? (
            <select
              name={name}
              className="form-select"
              value={formData[name] || ""}
              onChange={handleChange(name)}
              onBlur={(e) => handleBlur(name, e.target.value)}
            >
              {options.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={type}
              name={name}
              className="form-control"
              value={formData[name] || ""}
              onChange={handleChange(name)}
              onBlur={(e) => handleBlur(name, e.target.value)}
            />
          )}

          {error && <small className="text-danger">{error}</small>}
        </>
      ) : (
        <p className={`fw-bold mb-0 ${readOnly && isEditing ? 'text-dark' : ''}`}>
          {formData[name] || "N/A"}
          {readOnly && isEditing && (
            <small className="badge bg-light text-muted ms-2">locked</small>
          )}
        </p>
      )}
    </div>
  );
};

export default ProfileField;
