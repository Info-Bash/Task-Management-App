import { useState, useEffect, useCallback } from 'react';
import FilterBar from '../general/searchAndFilter';
import Pagination from '../general/pagination';
import API from "../../api/api"

const AdminTaskManager = () => {
  // State for server-side logic
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // Fixed limit

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

  // Helper function to get status config
  const getStatusConfig = (status) => {
    switch (status) {
      case "completed":
        return { label: "Completed", color: "success", border: "border-success" };
      case "verified":
        return { label: "Verified", color: "info", border: "border-info" };
      default:
        return { label: "Pending", color: "secondary", border: "border-secondary" };
    }
  };


  return (
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
            totalResults={tasks.length} // or total results from server
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
                <div className="col-12" key={task.id}>
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
                              <small className="d-block text-secondary">On: 
                                {task.displayTime}
                              </small>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="col-lg-2 text-end">
                          <div className="dropdown">
                            <button className="btn btn-light btn-sm border shadow-sm" type="button" data-bs-toggle="dropdown">
                              <i className="bi bi-three-dots-vertical"></i> Actions
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                              <li><button className="dropdown-item py-2"><i className="bi bi-eye me-2"></i>View Details</button></li>
                              <li><hr className="dropdown-divider" /></li>
                              <li><button className="dropdown-item py-2 text-danger"><i className="bi bi-trash me-2"></i>Delete Task</button></li>
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
  );
};

export default AdminTaskManager;