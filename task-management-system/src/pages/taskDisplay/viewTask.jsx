import { useOutletContext } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';

export function ViewTask() {
  const { task, loading, error } = useOutletContext();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" />
      </div>
    );
  };

  if (!task) {
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

  const taskId = task?._id;
  const showEditButton = task?.status === "pending";

  const user = JSON.parse(localStorage.getItem("user"));
  const notAdmin = user.role === "user";

  return (
    /* Main task view content area */
    <div className="bg-white p-4 mb-3 rounded-3 border-sm shadow-sm">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <h1 className="display-6 fw-bold mb-0 me-3">
          {task.title}
        </h1>
        <div className="d-flex gap-2 flex-wrap">
          <button
            className="btn btn-outline-secondary btn-sm px-3"
            onClick={() => navigate(-1)}
          >
            <i className="bi bi-arrow-left me-1"></i>
            Back
          </button>

          {showEditButton && notAdmin && (
            <Link
              to={`/task/${taskId}/edit`}
              className="btn btn-primary btn-sm px-3"
            >
              <i className="bi bi-pencil me-1"></i>
              Edit
            </Link>
          )}
        </div>
      </div>
      <label className="text-uppercase text-primary small fw-bold mb-2 d-block">
        Description
      </label>
      <div
        className="text-dark fs-5"
        style={{
          whiteSpace: 'pre-wrap',
          lineHeight: '1.8'
        }}
      >
        {task.desc ||
          <span className="text-muted fst-italic">
            No description provided.
          </span>}
      </div>
    </div>
  );
}