import { useState, useRef } from "react";
import { createTaskSchema } from "../../schemas/task.schema";
import { useFormHandler } from "../../hooks/useFormHandler";
import { useFormValidation } from "../../hooks/useFormValidation";
import { handleKeyDown } from "../../hooks/handleKeyDown";
import API from "../../api/api";
import { toast } from "react-toastify";

export function EditingTask({ onClose, task, setTasks }) {
  const editTaskRef = useRef(null);
  const [editTaskData, setEditTaskData] = useState({
    title: task.title,
    desc: task.desc,
    id: task._id
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { validateField } = useFormValidation(createTaskSchema, setErrors);
  const { handleChange, handleBlur } = useFormHandler(
    setEditTaskData,
    touched,
    setTouched,
    validateField
  );

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const result = createTaskSchema.safeParse(editTaskData);

    if (!result.success) {
      const firstIssue = result.error.issues[0];
      const field = firstIssue.path[0];

      setErrors(prev => ({ ...prev, [field]: firstIssue.message }));

      const firstInvalidField =
        editTaskRef.current?.querySelector(`[name="${field}"]`);

      firstInvalidField?.focus();
      return;
    }

    try {

      setIsSubmitting(true);
      const res = await API.patch(`/user/edit-task/${editTaskData.id}`, editTaskData);

      setTasks(prev =>
        prev.map(t => (t._id === editTaskData.id ? { ...t, title: res.data.data.title, desc: res.data.data.desc } : t))
      );

      setIsSubmitting(false);
      toast.success(res.data.message || "Task updated successfully");
      onClose();

    } catch (error) {
      console.error(error);

      const message =
        error.response?.data?.message || "Failed to update task";

      toast.error(message);

      // Show backend error under title if duplicate
      if (message.toLowerCase().includes("title")) {
        setErrors(prev => ({ ...prev, title: message }));
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        {/* FORM WRAPS EVERYTHING */}
        <form
          className="modal-content shadow-lg"
          ref={editTaskRef}
          noValidate
          onKeyDown={(e) => handleKeyDown(editTaskRef, e)}
          onSubmit={onSubmit}
        >
          {/* Header */}
          <div className="modal-header bg-light">
            <h5 className="modal-title">Edit Task</h5>
            <button disabled={isSubmitting} type="button" className="btn-close" onClick={onClose}></button>
          </div>

          {/* Body */}
          <div className="modal-body" style={{ height: '350px', overflowY: 'auto' }}>
            <div className="container-fluid"> {/* Added container-fluid for better padding control */}
              <div className="mb-3">
                <label className="form-label fw-bold text-secondary">Task Title</label>
                <input
                  name="title"
                  type="text"
                  className={`form-control ${errors.title ? "is-invalid" : ""}`}
                  value={editTaskData.title}
                  onChange={handleChange("title")}
                  onBlur={() => handleBlur("title", editTaskData.title)}
                />
                {errors.title && <div className="invalid-feedback">{errors.title}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold text-secondary">Description</label>
                <textarea
                  name="desc"
                  rows={5}
                  className={`form-control ${errors.desc ? "is-invalid" : ""}`}
                  value={editTaskData.desc}
                  onChange={handleChange("desc")}
                  onBlur={() => handleBlur("desc", editTaskData.desc)}
                />
                {errors.desc && <div className="invalid-feedback">{errors.desc}</div>}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer border-top-0">
            <button disabled={isSubmitting} type="button" className="btn btn-outline-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary px-4" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              ) : null}
              Update Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}