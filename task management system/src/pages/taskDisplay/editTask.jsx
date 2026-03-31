import { useState, useEffect, useRef } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { createTaskSchema } from "../../schemas/task.schema";
import { useFormHandler } from "../../hooks/useFormHandler";
import { useFormValidation } from "../../hooks/useFormValidation";
import { handleKeyDown } from "../../hooks/handleKeyDown";
import { toast } from 'react-toastify';
import API from '../../api/api';

export function EditTask() {
  const { task, setTask, loading, error } = useOutletContext();

  const navigate = useNavigate();

  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const editTaskRef = useRef(null);

  const [editTaskData, setEditTaskData] = useState(() => ({
    title: task?.title || "",
    desc: task?.desc || "",
    id: task?._id || ""
  }));

  useEffect(() => {
    if (task) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setEditTaskData({
        title: task.title || "",
        desc: task.desc || "",
        id: task._id
      });
    }
  }, [task]);


  const { validateField } = useFormValidation(createTaskSchema, setFormErrors);
  const { handleChange, handleBlur } = useFormHandler(
    setEditTaskData,
    touched,
    setTouched,
    validateField
  );

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});

    const result = createTaskSchema.safeParse(editTaskData);

    if (!result.success) {
      const firstIssue = result.error.issues[0];
      const field = firstIssue.path[0];

      setFormErrors(prev => ({ ...prev, [field]: firstIssue.message }));

      const firstInvalidField =
        editTaskRef.current?.querySelector(`[name="${field}"]`);

      firstInvalidField?.focus();
      return;
    }

    try {

      setIsSubmitting(true);
      const res = await API.patch(`/user/edit-task/${editTaskData.id}`, editTaskData);

      setTask(prev => ({
        ...prev,
        title: editTaskData.title,
        desc: editTaskData.desc,
        updatedAt: new Date().toISOString()
      }));

      setIsSubmitting(false);
      toast.success(res.data.message || "Task updated successfully");
      //onClose();

    } catch (error) {
      console.error(error);

      const message =
        error.response?.data?.message || "Failed to update task";

      toast.error(message);

      // Show backend error under title if duplicate
      if (message.toLowerCase().includes("title")) {
        setFormErrors(prev => ({ ...prev, title: message }));
      }
      setIsSubmitting(false);
    }
  };

  const changesMade =
    task &&
    (editTaskData.title !== task.title ||
      editTaskData.desc !== task.desc);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" />
      </div>
    );
  };

  if (!task && !loading) {
    return (
      <>
        <button
          className="btn btn-outline-secondary btn-sm mb-3"
          onClick={() => navigate(-1)}
        >
          <i className="bi bi-arrow-left me-1"></i>
          Back
        </button>
        <div className="alert alert-danger">
          {error || "Task not found."}
        </div>
      </>
    );
  };


  return (
    <div className="bg-white p-4 rounded-3 border-0 shadow-sm mb-3">
      <header className="mb-4">
        <h3 className="fw-bold text-dark mb-1">Edit Task</h3>
        <p className="text-muted small">Update the details and save your changes below.</p>
      </header>

      <form
        ref={editTaskRef}
        noValidate
        onKeyDown={(e) => handleKeyDown(editTaskRef, e)}
        onSubmit={onSubmit}
      >
        <div className="mb-4">
          <label className="form-label fw-semibold small text-uppercase tracking-wide">Task Title</label>
          <input
            name="title"
            placeholder="e.g. Design System Update"
            className={`form-control form-control-lg py-2 ${formErrors.title ? "is-invalid" : ""}`}
            value={editTaskData.title}
            onChange={handleChange("title")}
            onBlur={() => handleBlur("title", editTaskData.title)}
          />
          {formErrors.title && <div className="invalid-feedback">{formErrors.title}</div>}
        </div>

        <div className="mb-4">
          <label className="form-label fw-semibold small text-uppercase tracking-wide">Description</label>
          <textarea
            name="desc"
            placeholder="Provide more context..."
            className={`form-control  py-2 ${formErrors.desc ? "is-invalid" : ""}`}
            rows="10"
            value={editTaskData.desc}
            onChange={handleChange("desc")}
            onBlur={() => handleBlur("desc", editTaskData.desc)}
            style={{ resize: 'none' }}
          />
          {formErrors.desc && <div className="invalid-feedback">{formErrors.desc}</div>}
        </div>

        <div className="d-flex align-items-center justify-content-between mt-5 pt-3 border-top">
          <button
            type="button"
            className="btn btn-light text-secondary fw-medium px-4"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn btn-primary px-5 fw-bold shadow-sm"
            disabled={isSubmitting || !changesMade}
          >
            {isSubmitting ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Saving...
              </>
            ) : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}