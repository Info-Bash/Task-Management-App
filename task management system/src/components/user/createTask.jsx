import { useRef, useState, useEffect } from "react";
import { createTaskSchema } from "../../schemas/task.schema";
import { useFormHandler } from "../../hooks/useFormHandler";
import { useFormValidation } from "../../hooks/useFormValidation";
import { handleKeyDown } from "../../hooks/handleKeyDown";
import { ConfirmationModal } from "../general/confirmationModal";
import API from "../../api/api";

export function CreateTask ( {setTasks} ) {
  const [createTaskVisible, setCreateTaskVisible] = useState(false);
  const taskRef = useRef(null);
  const [taskData, setTaskData] = useState({
    title: "",
    desc: ""
  });
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const [updateStatus, setUpdateStatus] = useState("");




  const { validateField } = useFormValidation(
    createTaskSchema,
    setErrors
  );


  const { handleChange, handleBlur } = useFormHandler(
    setTaskData,
    touched,
    setTouched,
    validateField
  );

  const handleCancel = () => {
    // Check if title or desc has any text
    if (taskData.title.trim() !== "" || taskData.desc.trim() !== "") {
      setShowCancelConfirm(true);
    } else {
      setCreateTaskVisible(false);
      setErrors({});
    }
  };

  const confirmDiscard = () => {
    setErrors({});
    setTaskData({
      title: "",
      desc: ""
    });
    setShowCancelConfirm(false);
    setCreateTaskVisible(false);
  };

  useEffect(() => {
      if (!updateMessage) return;
  
      const timer = setTimeout(() => {
        setUpdateMessage("");
        setUpdateStatus("");
      }, 3000);
      return () => clearTimeout(timer);
    }, [updateMessage]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setErrors({});

  const result = createTaskSchema.safeParse(taskData);

  // CLIENT-SIDE VALIDATION
  if (!result.success) {
    const firstIssue = result.error.issues[0];
    const field = firstIssue.path[0];

    setErrors((prev) => ({
      ...prev,
      [field]: firstIssue.message,
    }));

    const firstInvalidField =
      taskRef.current?.querySelector(`[name="${field}"]`);

    firstInvalidField?.focus();
    return;
  }

  setUpdateLoading(true);
  setUpdateMessage("");
  setUpdateStatus("");

  try {
    const response = await API.post("/user/create-task", result.data);
    const newTask = response.data.data;

    if (response.data.success) {
      setUpdateStatus("success");
      setUpdateMessage(response.data.message);

      setTaskData({ title: "", desc: "" });
      setErrors({});
      setTasks(prev => [newTask, ...prev]); // updates TaskSection automatically
    } else {
      setUpdateStatus("error");
      setUpdateMessage(response.data.message || "Failed to Create Task");
    }
  } catch (e) {
    const backendErrors = e.response?.data?.errors;

    if (backendErrors && typeof backendErrors === "object") {
      setErrors(backendErrors);

      const firstField = Object.keys(backendErrors)[0];
      const fieldEl =
        taskRef.current?.querySelector(`[name="${firstField}"]`);
      fieldEl?.focus();
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
    <>
      <div className="container mt-4">
        {createTaskVisible ? (

          /* Create Task Form */
          <div className="container mt-4">
            <div className="row justify-content-center">
              <div className="col-12 col-md-6 col-lg-5">
                <div className="card shadow-sm p-4">
                  <h3 className="mb-4 h5 fw-bold">Create New Task</h3>

                  <form
                    ref={taskRef}
                    noValidate
                    onKeyDown={(e) => handleKeyDown(taskRef, e)}
                    onSubmit={handleSubmit}
                  >
                    {/* Task Title Field */}
                    <div className="mb-3">
                      <label htmlFor="taskTitle" className="form-label small fw-bold">
                        Task Title
                      </label>

                      <input
                        name="title"
                        type="text"
                        className={`form-control ${errors.title ? "is-invalid" : ""}`}
                        value={taskData.title}
                        onChange={handleChange("title")}
                        onBlur={() => handleBlur("title", taskData.title)}
                        placeholder="e.g. Design Homepage"
                      />

                      {errors.title && (
                        <div className="invalid-feedback">
                          {errors.title}
                        </div>
                      )}
                    </div>

                    {/* Task Description Field */}
                    <div className="mb-3">
                      <label htmlFor="taskDescription" className="form-label small fw-bold">
                        Description
                      </label>

                      <textarea
                        name="desc"
                        rows={5}
                        className={`form-control ${errors.desc ? "is-invalid" : ""}`}
                        placeholder="Describe the steps involved..."
                        value={taskData.desc}
                        onChange={handleChange("desc")}
                        onBlur={() => handleBlur("desc", taskData.desc)}
                      />

                      {errors.desc && (
                        <div className="invalid-feedback">
                          {errors.desc}
                        </div>
                      )}
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

                    {/* Flexbox container for buttons */}
                    <div className={`d-flex gap-2 pt-2 ${updateLoading ? "disabled" : ""}`}>

                      <button type="submit" className="btn btn-primary px-4 ">
                        {updateLoading ?
                          <>
                            <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                            <span className="visually-hidden" role="status">Loading...</span>
                          </> :
                          "Submit"}
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary px-4"
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Create Task Button */
          <div className="d-flex justify-content-center my-4">
            <div
              className="card align-items-center cursor-pointer p-4 task-add-card"
              onClick={() => setCreateTaskVisible(true)}
              style={{ cursor: 'pointer', width: '200px' }}
            >
              <img src="plus-circle-dotted.svg" width={100} alt="Add" title="Add New Task" />
              <span className="mt-2 fw-bold text-primary">Add Task</span>
            </div>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      <ConfirmationModal
        isOpen={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        onConfirm={confirmDiscard} // This would reset form and close main modal
        icon="⚠️"
        title="Discard Changes"
        message="You have unsubmitted changes."
        subMessage="Are you sure you want to leave?"
        confirmText={<>Discard <i className="bi bi-exclamation-triangle ms-1"></i>
        </>
        }
        cancelText="Keep Editing"
        confirmBtnClass="btn-danger text-white"
      />

    </>
  );

}