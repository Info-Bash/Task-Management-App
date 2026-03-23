import { useEffect, useState } from 'react';
import { ConfirmationModal } from '../general/confirmationModal';
import { EditingTask } from './editingTask';
import { smartDate } from '../../utils/dateFormat';
import ActionDropdown from '../general/floatingDropdown';
import useApiWithToast from '../../hooks/useApiWithToast';
import API from '../../api/api';

const TaskManager = ({ tasks, setTasks }) => {
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'completed'
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [delLoading, setDelLoading] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [activeDropdownId, setActiveDropdownId] = useState(null); // Track which dropdown is open
  const [editingTask, setEditingTask] = useState(null);

  // Custom hook for API calls with toast notifications
  const { execute } = useApiWithToast();

  useEffect(() => {
    const fetchUserTasks = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/user/tasks`);
        setTasks(res.data.data);
        setError("");
      } catch (e) {
        console.error("Error fetching user tasks:", e);
        setError("Failed to load tasks. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserTasks();
  }, [setTasks]);


  /* const filteredTasks = tasks.filter(t => t.status === activeTab); */
  const filteredTasks = tasks.filter(task => {
    if (activeTab === 'pending') return task.status === 'pending';
    // Exclude verified tasks from the general completed tab to keep them separate
    if (activeTab === 'completed') return task.status === 'completed';
    if (activeTab === 'verified') return task.status === 'verified';
    return true;
  });

  // Handle Selection
  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredTasks.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTasks.map(t => t._id));
    }
  };

  const handleScroll = () => {
    const dropdowns = document.querySelectorAll('.dropdown-menu.show');
    dropdowns.forEach(menu => {
      menu.classList.remove('show');
    });
  };


  // Trigger for single delete (from dropdown)
  const triggerSingleDelete = (id) => {
    setSelectedIds([id]);
    setShowDeleteModal(true);
  };

  // Trigger for bulk delete (from top bar)
  const triggerBulkDelete = () => {
    setSelectedIds(selectedIds);
    setShowDeleteModal(true);
  };

  // final delete execution after confirmation
  const confirmDelete = async () => {
    setDelLoading(true);

    try {
      await execute(
        () => {
          if (selectedIds.length === 1) {
            return API.delete(`/user/delete-task/${selectedIds[0]}`);
          } else {
            return API.delete(`/user/delete-multiple-tasks`, {
              data: { ids: selectedIds },
            });
          }
        },
        {
          loadingMessage: "Deleting task(s)...",
          successMessage: "Deleted successfully!",
          onSuccess: () => {
            // Update UI only after success
            setTasks((prev) =>
              prev.filter((t) => !selectedIds.includes(t._id))
            );
            setSelectedIds([]);
          },
        }
      );
    } finally {
      setDelLoading(false);
      setShowDeleteModal(false);
    }
  };


  const completeTask = async (id) => {
    await execute(
      () => API.patch(`/user/mark-completed/${id}`),
      {
        loadingMessage: "Marking task as completed...",
        successMessage: "Task marked completed!",
        onSuccess: (res) => {
          // Update local state after success
          setTasks((prev) =>
            prev.map((t) =>
              t._id === id
                ? {
                  ...t,
                  status: res.data.data.status,
                  dateCompleted: res.data.data.dateCompleted,
                }
                : t
            )
          );
        },
      }
    );
  };


  /* Update the component every minute to refresh the UI */
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 60000);

    return () => clearInterval(interval);
  }, []);


  return (
    <>
      <div className="container mt-5 shadow-sm bg-white p-0" style={{ borderRadius: '8px', border: '1px solid #dee2e6' }}>
        {/* TABS HEADER */}
        <div
          className="d-flex border-bottom overflow-x-auto flex-nowrap"
          style={{
            scrollbarWidth: 'none', // Hides scrollbar for Firefox
            msOverflowStyle: 'none', // Hides scrollbar for IE/Edge
            WebkitOverflowScrolling: 'touch' // Smooth scrolling for iOS
          }}
        >
          {/* Style tag to hide scrollbar for Chrome/Safari */}
          <style>{`.overflow-x-auto::-webkit-scrollbar { display: none; }`}</style>

          {/* PENDING TAB */}
          <button
            className={`btn px-3 px-md-4 py-3 fw-bold rounded-0 flex-fill text-nowrap ${activeTab === 'pending' ? 'border-bottom border-2 border-primary text-primary' : 'text-muted'}`}
            onClick={() => { setActiveTab('pending'); setSelectedIds([]); }}
          >
            PENDING <span className="badge bg-secondary ms-1">{tasks.filter(t => t.status === 'pending').length}</span>
          </button>

          {/* COMPLETED TAB */}
          <button
            className={`btn px-3 px-md-4 py-3 fw-bold rounded-0 flex-fill text-nowrap ${activeTab === 'completed' ? 'border-bottom border-2 border-primary text-primary' : 'text-muted'}`}
            onClick={() => { setActiveTab('completed'); setSelectedIds([]); }}
          >
            COMPLETED <span className="badge bg-success ms-1">{tasks.filter(t => t.status === 'completed' && !t.verified).length}</span>
          </button>

          {/* VERIFIED TAB */}
          <button
            className={`btn px-3 px-md-4 py-3 fw-bold rounded-0 flex-fill text-nowrap ${activeTab === 'verified' ? 'border-bottom border-2 border-primary text-primary' : 'text-muted'}`}
            onClick={() => { setActiveTab('verified'); setSelectedIds([]); }}
          >
            VERIFIED <span className="badge bg-info ms-1">{tasks.filter(t => t.status === 'verified').length}</span>
          </button>
        </div>

        {/* ACTION BAR / TABLE HEADER */}
        <div className="table-responsive">
          <table className="table mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th style={{ width: '50px' }} className="ps-4">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    onChange={toggleSelectAll}
                    checked={filteredTasks.length > 0 && selectedIds.length === filteredTasks.length}
                  />
                </th>
                <th className="text-muted small fw-bold">
                  {selectedIds.length > 0 ? (
                    <button className="btn btn-sm btn-outline-danger py-0" onClick={triggerBulkDelete}>
                      Delete Selected ({selectedIds.length})
                    </button>
                  ) : 'TASK'}
                </th>
                <th className="text-muted small fw-bold text-end pe-4">ACTIONS</th>
              </tr>
            </thead>
          </table>

          {/* SCROLLABLE BODY */}
          <div style={{ maxHeight: '400px', overflowY: 'auto' }} onScroll={handleScroll}>
            <table className="table table-hover mb-0 align-middle">
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="3" className="text-center py-4 text-muted">
                      <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                      <span className="visually-hidden" role="status">Loading...</span>
                    </td>
                  </tr>

                ) : error ? (
                  <tr>
                    <td colSpan="3" className="text-center py-2 text-danger">
                      <i className="bi bi-exclamation-triangle d-block" style={{ fontSize: "2rem" }}></i>
                      <p className="my-1">{error}</p>
                    </td>
                  </tr>

                ) : filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-2">
                      <div className="text-muted">
                        <i className="bi bi-clipboard-x d-block" style={{ fontSize: "2rem" }}></i>
                        <p className="my-1">No {activeTab} tasks yet.</p>
                      </div>
                    </td>
                  </tr>

                ) : (
                  filteredTasks.map((task) => (
                    <tr key={task._id}>
                      <td style={{ width: '50px' }} className="ps-4">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={selectedIds.includes(task._id)}
                          onChange={() => toggleSelect(task._id)}
                        />
                      </td>

                      <td>
                        <div className="d-flex align-items-center">
                          <div className="bg-light rounded d-none d-md-block me-3" style={{ width: '50px', height: '40px' }}>
                            <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted">
                              📝
                            </div>
                          </div>
                          <div>
                            <div className="fw-bold text-dark text-truncate" style={{ maxWidth: '300px' }}>{task.title}</div>
                            <div className="text-muted small text-truncate" style={{ maxWidth: '300px' }}>{task.desc}</div>
                            <div className="x-small text-secondary mt-1" style={{ fontSize: '11px' }}>
                              Created: {smartDate(task.createdAt, now)}
                              {task.dateCompleted && <> | Completed: {smartDate(task.dateCompleted, now)}</>}
                              {task.dateVerified && <> | Verified: {smartDate(task.dateVerified, now)}</>}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="text-end pe-4">
                        {activeTab === 'pending' ? (
                          <ActionDropdown
                            isOpen={activeDropdownId === task._id}
                            onToggle={() => setActiveDropdownId(activeDropdownId === task._id ? null : task._id)}
                            onClose={() => setActiveDropdownId(null)}
                            onComplete={() => completeTask(task._id)}
                            onView={task._id}
                            onEdit={() => setEditingTask(task)}
                            onDelete={() => triggerSingleDelete(task._id)}
                          />
                        ) : (
                          <ActionDropdown
                            isOpen={activeDropdownId === task._id}
                            onToggle={() => setActiveDropdownId(activeDropdownId === task._id ? null : task._id)}
                            onClose={() => setActiveDropdownId(null)}
                            onView={task._id}
                            onDelete={() => triggerSingleDelete(task._id)}
                          />
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

            </table>
          </div>
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        loading={delLoading}
        icon="⚠️"
        onClose={() => {
          setShowDeleteModal(false)
          setSelectedIds([])
        }}
        onConfirm={confirmDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete"
        subMessage={`${selectedIds.length} tasks?`}
        cancelText={<>Cancel <i className="bi bi-x-lg ms-1"></i></>}
        confirmText={<> Yes, Delete <i className="bi bi-trash ms-1"></i></>}
        confirmBtnClass="btn-danger"
      />

      {/* VIEW TASK MODAL */}
      {/* {viewingTask && (
        <ViewTask
          task={viewingTask}
          onClose={() => setViewingTask(null)}
          onEdit={() => {
            setEditingTask(viewingTask); Switch to edit mode
            setViewingTask(null);         Close view mode
          }}
          showEditButton={activeTab === 'pending'}
        />
      )} */}

      {/* EDIT TASK MODAL */}
      {editingTask && (
        <EditingTask
          task={editingTask}
          onClose={() => setEditingTask(null)}
          setTasks={setTasks}
        />
      )}


    </>
  );
};

export default TaskManager;