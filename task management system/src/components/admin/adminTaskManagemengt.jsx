import { useState, useEffect, useCallback } from 'react';
import FilterBar from '../general/searchAndFilter';
import Pagination from '../general/pagination';
import API from "../../api/api"
import { smartDate } from '../../utils/dateFormat';
import getStatusConfig from '../../helpers/getStatusColor';
import useApiWithToast from '../../hooks/useApiWithToast';
import { ConfirmationModal } from '../general/confirmationModal';

const AdminTaskManager = () => {
  // State for server-side logic
  const [tasks, setTasks] = useState([]);
  const [now, setNow] = useState(() => Date.now());
  const [totalTasks, setTotalTasks] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8; // Fixed limit

  // State for confirmation modal
  const [confirming, setConfirming] = useState(false);
  const [modal, setModal] = useState(null);

  // API hook for actions with toast notifications
  const { execute } = useApiWithToast();

  // --- 2. Memoized Fetch Function ---
  const fetchTasks = useCallback(async (currentSearch) => {
    setLoading(true);
    try {

      let query = `?page=${page}&limit=${limit}`

      if (currentSearch) {
        query += `&search=${currentSearch}`;
      }

      if (filter && filter !== 'all') {
        query += `&status=${filter}`;
      }

      // Full API: /api/tasks?page=2&limit=10&search=report&status=completed
      const response = await API.get(`/admin/tasks${query}`);
      const data = response.data;

      console.log('response data:', data);

      setTasks(data.tasks || []);
      setTotalTasks(data.totalTasks || 0);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  }, [page, filter]); // Only changes when these values change


  // 1. Debounce Logic for Search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTasks(search);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(delayDebounceFn);
  }, [search, fetchTasks]); // Re-run when search or fetchTasks changes

  // Role options
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'verified', label: 'Verified' }
  ];

  /* Update the component every minute to refresh the UI */
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  //Marked task verified
  const markedVerified = async (taskId) => {
    setConfirming(true);
    try {
      await execute(
        () => API.patch(`/admin/task/${taskId}/verify`),
        {
          loadingMessage: "Marking task as verified...",
          successMessage: "Task marked as verified!",
          onSuccess: () => {
            fetchTasks(search);
          },
        }
      );
    } finally {
      setConfirming(false);
      setModal(null);
    }
  };

  // Delete Task 
  const deleteTask = async (taskId) => {
    setConfirming(true);
    try {
      await execute(
        () => API.delete(`/admin/task/${taskId}`),
        {
          loadingMessage: "Deleting task...",
          successMessage: "Task deleted successfully!",
          onSuccess: () => {
            fetchTasks(search);
          },
        }
      );
    } finally {
      setConfirming(false);
      setModal(null);
    }
  };

  // Determine if the action is delete or verify for modal configuration
  const isDelete = modal?.action === "delete";

  // Configuration for confirmation modal based on action type
  const actionConfig = {
    delete: {
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this task ?",
      BtnText: "Delete",
      icon: "bi bi-trash",
      btnClass: "btn-danger"
    },
    verify: {
      title: "Confirm Verification",
      message: "Are you sure you want to verify this task ?",
      BtnText: "Verify",
      icon: "bi bi-check-circle",
      btnClass: "btn-success"
    }
  };

  // Get the current configuration based on the action
  const config = actionConfig[modal?.action];

  return (
    <>
      <div className="container my-4 p-4 bg-light rounded-3 shadow-sm">
        <div className="container">
          {/* Header Section */}
          <div className="d-md-flex align-items-center justify-content-between mb-4">
            <div>
              <h3 className="fw-bold text-dark mb-1">Task Management</h3>
              <p className="text-muted small">Monitor and manage all users tasks</p>
            </div>

            {/* Search and Filter Bar */}
            <FilterBar
              search={search}
              setSearch={setSearch}
              filterValue={filter}
              setFilterValue={setFilter}
              totalResults={totalTasks} // or total results from server
              setPage={setPage}
              options={statusOptions}
              placeholder="Find tasks..."
            />
          </div>

          {/* Task List Section */}
          <div className="row g-3">
            {loading ? (
              <div className="col-12 text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
              </div>
            ) : tasks.length > 0 ? (
              tasks.map((task) => {
                const config = getStatusConfig(task.status);
                return (
                  <div className="col-12" key={task._id}>
                    <div className={`card shadow-sm border-0 border-start border-4 ${config.border} hover-shadow-transition`}>
                      <div className="card-body p-4">
                        <div className="row align-items-center">
                          {/* Title & Description */}
                          <div className="col-lg-4 mb-3 mb-lg-0">
                            <span className={`badge bg-${config.color}-subtle text-${config.color} mb-2`}>
                              {config.label}
                            </span>
                            <h6 className="fw-bold text-truncate mb-1">{task.shortTitle}</h6>
                            <p className="text-muted small mb-0 text-truncate" style={{ maxWidth: '90%' }}>
                              {task.shortDescription}
                            </p>
                          </div>

                          {/* Metadata */}
                          <div className="col-lg-2 col-6 border-start-md">
                            <div className="small text-muted mb-1">Created By</div>
                            <div className="d-flex align-items-center">
                              <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center me-2" style={{ width: '24px', height: '24px', fontSize: '10px' }}>
                                {task.ownerUsername.charAt(0).toUpperCase()}
                              </div>
                              <span className="fw-medium small">{task.ownerUsername}</span>
                            </div>
                          </div>

                          {/* Timestamps */}
                          <div className="col-lg-4 col-6">
                            <div className="row g-0">
                              <div className="col-6">
                                <div className="small text-muted mb-1">
                                  {task.status === 'completed' ? 'Completed' : task.status === 'verified' ? 'Verified' : 'Created'}
                                </div>
                                <small className="d-block text-secondary">On: {smartDate(task.displayTime, now)}
                                </small>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="col-lg-2 text-end">
                            <div className="dropdown">
                              <button className="btn btn-light btn-sm border shadow-sm" type="button" data-bs-toggle="dropdown">
                                <i className="bi bi-three-dots-vertical"></i>
                              </button>
                              <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                                <li><button className="dropdown-item py-2"><i className="bi bi-eye me-2"></i>View Details</button></li>
                                {task.status === 'completed' && (
                                  <li><button className="dropdown-item py-2" onClick={() => {
                                    setModal(prev => ({
                                      ...prev,
                                      open: true,
                                      taskId: task._id,
                                      title: task.shortTitle,
                                      action: "verify"
                                    }));
                                  }}><i className="bi bi-check-circle me-2"></i>Mark Verified</button></li>
                                )}
                                {task.status === 'verified' && (
                                  <>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><button className="dropdown-item py-2 text-danger" onClick={() => {
                                      setModal(prev => ({
                                        ...prev,
                                        open: true,
                                        taskId: task._id,
                                        title: task.shortTitle,
                                        action: "delete"
                                      }));
                                    }}><i className="bi bi-trash me-2"></i>Delete Task</button></li>
                                  </>
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-12 text-center py-5">
                <p className="text-muted">No tasks found matching your criteria.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="d-flex flex-column flex-md-row justify-content-center justify-content-md-between align-items-center mt-4 px-2 gap-3">
            <div className="text-muted small text-center text-md-start">
              Showing Page <strong>{page}</strong> of {totalPages}
            </div>

            {/* Pagination Component */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center">
                <Pagination
                  page={page}
                  setPage={setPage}
                  totalPages={totalPages}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modal?.open}
        loading={confirming}
        icon="⚠️"
        onClose={() => setModal(null)}
        onConfirm={() => {
          isDelete ? deleteTask(modal?.taskId) :
            markedVerified(modal?.taskId);
        }}
        title={config?.title}
        message={config?.message}
        subMessage={`${modal?.title}`}
        cancelText={<>Cancel <i className="bi bi-x-lg ms-1"></i></>}
        confirmText={
          <>
            Yes, {config?.BtnText}
            <i className={config?.icon + " ms-1"}></i>
          </>
        }
        confirmBtnClass={config?.btnClass}
      />
    </>
  );
};

export default AdminTaskManager;