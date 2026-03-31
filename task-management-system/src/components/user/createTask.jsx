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
          <div className="d-flex justify-content-center my-5">
  <button 
    type="button"
    className="btn task-add-card d-flex flex-column align-items-center justify-content-center p-4"
    onClick={() => setCreateTaskVisible(true)}
  >
    <div className="icon-wrapper mb-3">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-plus-circle-dotted text-primary" viewBox="0 0 16 16">
        <path d="M8 0q-.264 0-.523.017l.064.998a7 7 0 0 1 .918 0l.064-.998A8 8 0 0 0 8 0M6.44.152q-.52.104-1.012.27l.321.948q.424-.144.873-.233zM4.99.904q-.48.225-.911.51l.544.837c.37-.245.78-.439 1.188-.631zm-1.55 1.116q-.413.33-.77.711l.728.687q.308-.328.663-.612zM1.916 3.55q-.312.427-.563.89l.885.468q.217-.398.487-.765zM.904 4.99q-.225.48-.51.911l.837.544c.245-.37.439-.78.631-1.188zM.152 6.44q-.104.52-.152 1.012l.998.064q.041-.43.12-.855zm.017 2.037q.017.523.104 1.012l.948-.321q-.074-.424-.089-.873zM.904 11.01q.225.48.51.911l.837-.544c-.245.37-.439.78-.631 1.188zM3.55 14.084q.427.312.89.563l.468-.885q-.398-.217-.765-.487zm2.89 1.764q.52.104 1.012.152l.064-.998q-.43-.041-.855-.12zM8 16q.264 0 .523-.017l-.064-.998a7 7 0 0 1-.918 0l-.064.998A8 8 0 0 0 8 16m1.56-.152q.52-.104 1.012-.27l-.321-.948a7 7 0 0 1-.873.233zM11.01 15.096q.48-.225.911-.51l-.544-.837a7 7 0 0 1-1.188.631zm1.55-1.116q.413-.33.77-.711l-.728-.687a7 7 0 0 1-.663.612zm1.524-2.43q.312-.427.563-.89l-.885-.468a7 7 0 0 1-.487.765zm1.012-1.55q.225-.48.51-.911l-.837-.544a7 7 0 0 1-.631 1.188zm.752-2.56q.104-.52.152-1.012l-.998-.064a7 7 0 0 1-.12.855zm-.017-2.037q-.017-.523-.104-1.012l-.948.321c.063.424.084.873.089.873zM15.096 4.99q-.225-.48-.51-.911l-.837.544c.245.37.439.78.631 1.188zm-1.55-1.55a7 7 0 0 1-.77-.711l-.728.687c.308.328.663.612.663.612zM12.45 1.916q-.427-.312-.89-.563l-.468.885c.398.217.765.487.765.487zM9.56.152q-.52-.104-1.012-.152l-.064.998c.43.041.855.12.855.12zM8 4.5a.5.5 0 0 1 .5.5v2.5H11a.5.5 0 0 1 0 1H8.5V11a.5.5 0 0 1-1 0V8.5H5a.5.5 0 0 1 0-1h2.5V5a.5.5 0 0 1 .5-.5"/>
      </svg>
    </div>
    <span className="text-uppercase tracking-wider small fw-bold">Add New Task</span>
  </button>
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