import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api/api';

export function ViewTask({ onEdit, showEditButton = true }) {
  const { id } = useParams(); // Get the task ID from the URL
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getSingleTask = async (id) => {
    try {
      const response = await API.get(`/user/task/${id}`);
      return { data: response.data, error: null };
    } catch (error) {
      const message =
        error.response?.data?.message || "Something went wrong";

      console.error("Error fetching single task:", message);

      return { data: null, error: message };
    }
  };

  useEffect(() => {
    const fetchTask = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await getSingleTask(id);

      if (error) {
        setError(error);
      } else {
        setTask(data.data);
      }

      setLoading(false);
    };

    if (id) fetchTask();
  }, [id]);

  const handleBack = () => navigate(-1); // Goes back to the previous page

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          <div className="card border-0 shadow-lg">

            {/* Header */}
            <div className="card-header bg-white border-bottom-0 pt-4 px-4 d-flex justify-content-between align-items-center">
              <h5 className="text-uppercase text-muted small fw-bold tracking-wider mb-0">Task Details</h5>
              <button type="button" className="btn-close" onClick={handleBack} aria-label="Close"></button>
            </div>

            {/* Body Logic */}
            {loading ? (
              <div className="card-body d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : error ? (
              <div className="card-body py-5">
                <div className="alert alert-danger text-center mb-0">{error}</div>
              </div>
            ) : task ? (
              <div className="card-body pt-2 px-4 pb-4">
                <h2 className="display-5 fw-bold mb-2 text-dark">{task.title}</h2>
                <hr className="my-4 opacity-10" />
                <div className="task-content">
                  <label className="form-label text-primary fw-bold mb-2 small">DESCRIPTION</label>
                  <div
                    className="p-4 bg-light rounded"
                    style={{
                      minHeight: '200px',
                      whiteSpace: 'pre-wrap',
                      lineHeight: '1.8',
                      wordBreak: 'break-word',
                      border: '1px solid #eee',
                      fontSize: '1.1rem'
                    }}
                  >
                    {task.desc ? (
                      <p className="text-dark mb-0">{task.desc}</p>
                    ) : (
                      <p className="text-muted fst-italic">No description provided for this task.</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="card-body py-5 text-center">
                <p className="text-muted">{error || "Task not found."}</p>
              </div>
            )}

            {/* Footer - Only show Edit if task exists */}
            <div className="card-footer bg-white border-top-0 pt-3 pb-5 px-4 d-flex justify-content-between">
              <button type="button" className="btn btn-outline-secondary px-4" onClick={handleBack}>
                <i className="bi bi-arrow-left me-2"></i> Back to Dashboard
              </button>

              {showEditButton && task && task.id && (
                <button type="button" className="btn btn-primary px-4 shadow-sm" onClick={() => onEdit(task.id)}>
                  <i className="bi bi-pencil me-2"></i> Edit Task
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}