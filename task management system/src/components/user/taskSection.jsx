import { useEffect, useState } from 'react';
import { ConfirmationModal } from '../general/confirmationModal';
import getStatusTimestamp from '../../helpers/statusTimeStamp';
import ActionDropdown from '../general/floatingDropdown';
import useApiWithToast from '../../hooks/useApiWithToast';
import API from '../../api/api';

const TaskManager = ({ tasks, setTasks, error, loading }) => {

  const [activeTab, setActiveTab] = useState('pending');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const [delLoading, setDelLoading] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [activeDropdownId, setActiveDropdownId] = useState(null); // Track which dropdown is open

  // Custom hook for API calls with toast notifications
  const { execute } = useApiWithToast();


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

  /* const handleScroll = () => {
    const dropdowns = document.querySelectorAll('.dropdown-menu.show');
    dropdowns.forEach(menu => {
      menu.classList.remove('show');
    });
  }; */


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
      <div className="container mt-5 px-2 px-md-0 pb-5">
  {/* TABS HEADER - Responsive & Scrollable */}
  <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
    <div className="row g-2 mb-4">
    {[
      { id: 'pending', label: 'PENDING', color: 'secondary', count: tasks.filter(t => t.status === 'pending').length },
      { id: 'completed', label: 'COMPLETED', color: 'success', count: tasks.filter(t => t.status === 'completed' && !t.verified).length },
      { id: 'verified', label: 'VERIFIED', color: 'info', count: tasks.filter(t => t.status === 'verified').length }
    ].map((tab) => (
      <div key={tab.id} className="col-12 col-md-4">
        <button
          onClick={() => { setActiveTab(tab.id); setSelectedIds([]); }}
          className={`btn w-100 py-3 px-4 fw-bold rounded-3 shadow-sm border-0 transition-all d-flex justify-content-between align-items-center ${
            activeTab === tab.id 
              ? 'bg-primary text-white' 
              : 'bg-white text-muted border'
          }`}
        >
          <span>{tab.label}</span>
          <span className={`badge rounded-pill ${activeTab === tab.id ? 'bg-white text-primary' : `bg-${tab.color}`}`}>
            {tab.count}
          </span>
        </button>
      </div>
    ))}
  </div>

    {/* SELECTION & BULK ACTIONS BAR */}
    <div className="bg-light px-4 py-2 d-flex align-items-center justify-content-between border-bottom">
      <div className="d-flex align-items-center">
        <div className="form-check mb-0">
          <input
            type="checkbox"
            className="form-check-input mt-0"
            style={{ width: '1.1rem', height: '1.1rem' }}
            onChange={toggleSelectAll}
            checked={filteredTasks.length > 0 && selectedIds.length === filteredTasks.length}
          />
        </div>
        <span className="ms-3 small fw-bold text-muted text-uppercase tracking-wider">
          {selectedIds.length > 0 ? `${selectedIds.length} Selected` : 'Select All'}
        </span>
      </div>

      {selectedIds.length > 0 && (
        <button className="btn btn-sm btn-danger rounded-pill px-3 fw-bold" onClick={triggerBulkDelete}>
          <i className="bi bi-trash3 me-1"></i> Delete
        </button>
      )}
    </div>

    {/* BODY */}
    <div 
      className="p-3 bg-white"
    >
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="text-muted mt-2 small">Loading tasks...</p>
        </div>
      ) : error ? (
        <div className="text-center py-5 text-danger">
          <i className="bi bi-exclamation-triangle fs-1"></i>
          <p className="mt-2 fw-bold">{error}</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-clipboard-x text-muted fs-1 opacity-25"></i>
          <p className="text-muted mt-2">No {activeTab} tasks yet.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-2">
          {filteredTasks.map((task) => (
            <div 
              key={task._id} 
              className={`card border rounded-3 transition-all ${selectedIds.includes(task._id) ? 'border-primary bg-primary-subtle' : 'border-light-subtle'}`}
              style={{ transition: '0.2s ease' }}
            >
              <div className="card-body p-3">
                <div className="row align-items-center g-2">
                  {/* Select Checkbox */}
                  <div className="col-auto">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={selectedIds.includes(task._id)}
                      onChange={() => toggleSelect(task._id)}
                    />
                  </div>

                  {/* Task Icon (Desktop only) */}
                  <div className="col-auto d-none d-md-block ms-2">
                    <div className="bg-light rounded p-2 text-muted" style={{ width: '40px', height: '40px', display: 'grid', placeItems: 'center' }}>
                      📝
                    </div>
                  </div>

                  {/* Content */}
                  <div className="col px-md-3">
                    <div className="fw-bold text-dark text-truncate mb-0" style={{ maxWidth: '250px' }}>
                      {task.title}
                    </div>
                    <div className="text-muted small text-truncate" style={{ maxWidth: '300px' }}>
                      {task.desc}
                    </div>
                    <div className="text-secondary mt-1" style={{ fontSize: '11px' }}>
                      <i className="bi bi-calendar3 me-1"></i>
                      {getStatusTimestamp(task, now)}
                    </div>
                  </div>

                  {/* Actions - Matches your original conditional logic */}
                  <div className="col-12 col-md-auto mt-2 mt-md-0 d-flex justify-content-end">
                    {activeTab === 'pending' ? (
                      <ActionDropdown
                        isOpen={activeDropdownId === task._id}
                        onToggle={() => setActiveDropdownId(activeDropdownId === task._id ? null : task._id)}
                        onClose={() => setActiveDropdownId(null)}
                        onComplete={() => completeTask(task._id)}
                        onView={task._id}
                        onEdit={task._id}
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
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
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
    </>
  );
};

export default TaskManager;