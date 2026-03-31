import { useState, useEffect } from "react";
import { smartDate } from "../../utils/dateFormat";
import getStatusConfig from "../../helpers/getStatusColor";

function TaskSidebar({ task }) {

  const [now, setNow] = useState(() => Date.now());

  const config = getStatusConfig(task?.status);

  /* Update the component every minute to refresh the UI */
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  if (!task) return null;

  return (
    <div className="col-lg-4">
      {/* Sidebar Meta Info */}
      <div className="bg-white p-4 rounded-3 border shadow-sm">
        <h6 className="fw-bold mb-3 border-bottom pb-2">Task Details</h6>

        {/* Status Section */}
        <div className="mb-4">
          <small className="text-muted d-block text-uppercase fw-bold mb-1" style={{ fontSize: '0.7rem' }}>Status</small>
          <span className={`badge bg-${config.color}`}>{config.label}</span>
        </div>

        {/* Timeline Section */}
        <h6 className="fw-bold mb-3 border-bottom pb-2 pt-2">Timeline</h6>

        <div className="d-flex flex-column gap-3">
          {/* Created Date */}
          <div>
            <small className="text-muted d-block">Created</small>
            <p className="mb-0 small fw-medium text-dark">
              <i className="bi bi-calendar-plus me-2 text-primary"></i>
              {smartDate(task.createdAt, now)}
            </p>
          </div>

          {/* Updated Date */}
          <div>
            <small className="text-muted d-block">Last Updated</small>
            <p className="mb-0 small fw-medium text-dark">
              <i className="bi bi-clock-history me-2 text-primary"></i>
              {smartDate(task.updatedAt, now)}
            </p>
          </div>

          {/* Completed Date (Conditional) */}
          {task.dateCompleted && (
            <div>
              <small className="text-muted d-block">Completed</small>
              <p className="mb-0 small fw-medium text-success">
                <i className="bi bi-check-circle-fill me-2"></i>
                {smartDate(task.dateCompleted, now)}
              </p>
            </div>
          )}

          {/* Verified Date (Conditional) */}
          {task.dateVerified && (
            <div>
              <small className="text-muted d-block">Verified</small>
              <p className="mb-0 small fw-medium text-info">
                <i className="bi bi-patch-check-fill me-2"></i>
                {smartDate(task.dateVerified, now)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskSidebar;