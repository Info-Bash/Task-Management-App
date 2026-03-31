
import { useState, useEffect, useCallback } from 'react';
import FilterBar from '../general/searchAndFilter';
import Pagination from '../general/pagination';
import API from "../../api/api"
import useApiWithToast from '../../hooks/useApiWithToast';
import { ConfirmationModal } from '../general/confirmationModal';
import maleProfilePic from '../../assets/icons/male-profile-image.png';
import femaleProfilePic from '../../assets/icons/female-profile-image.png';
import othersProfilePic from '../../assets/icons/other-profile-image.png';

const UserManagement = () => {
  // State for Server Data
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // State for API Query Parameters
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [role, setRole] = useState('all');
  const [isActive, setIsActive] = useState('all');
  const limit = 8; // Fixed as per your requirement

  // State for Delete Confirmation Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteUserName, setDeleteUserName] = useState('');
  const [delLoading, setDelLoading] = useState(false);

  // useApiWithToast hook for handling API calls with toast notifications
  const { execute } = useApiWithToast();

  // Fetch Function
  const fetchUsers = useCallback(async (currentSearch) => {
    setLoading(true);
    try {

      let query = `?page=${page}&limit=${limit}`;

      if (currentSearch) {
        query += `&search=${currentSearch}`;
      }

      if (role && role !== 'all') {
        query += `&role=${role}`;
      }

      if (isActive && isActive !== 'all') {
        query += `&isActive=${isActive}`;
      }

      // Full API: /api/users?page=2&limit=10&search=bash&role=admin
      const res = await API.get(`/admin/users${query}`);

      const data = res.data;

      setUsers(data.users || []);
      setTotalPages(data.totalPages || 1);
      setTotalResults(data.totalResults || 0);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  }, [page, role, isActive]); // Only recreate if page or role changes

  // Debounce Logic for Search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers(search);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(delayDebounceFn);
  }, [search, fetchUsers]);

  /* Handle User Activation */
  const handleUserActivation = (isActive, userId) => {
    const newStatus = !isActive;

    execute(
      () =>
        API.patch(`/admin/toggle-user/${userId}`, {
          isActive: newStatus,
        }),
      {
        loadingMessage: "Updating user status...",
        successMessage: `User ${newStatus ? "activated" : "suspended"
          } successfully`,
        onSuccess: () => fetchUsers(search),
      }
    );
  };

  /* Handle User Role Update */
  const handleUserRole = (role, userId) => {
    const newRole = role === "admin" ? "user" : "admin";

    execute(
      () =>
        API.patch(`/admin/users/${userId}/role`, {
          role: newRole,
        }),
      {
        loadingMessage: "Updating user role...",
        successMessage: `User role updated to ${newRole}`,
        onSuccess: () => fetchUsers(search),
      }
    );
  };

  // Role options
  const statusOptions = [
    { value: 'all', label: 'All Role' },
    { value: 'admin', label: 'admin' },
    { value: 'user', label: 'user' }
  ];

  // Active status options
  const activeStatusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'true', label: 'Active' },
    { value: 'false', label: 'Suspended' }
  ];

  // Confirm User Delete
  const confirmUserDelete = async () => {
    const userId = selectedIds[0];
    setDelLoading(true);
    try {
      await execute(
        () => API.delete(`/admin/users/delete/${userId}`),
        {
          loadingMessage: "Deleting user...",
          successMessage: "User deleted successfully",
          onSuccess: () => {
            setSelectedIds([]);
            fetchUsers(search);
          },
        }
      );
    } finally {
      setDelLoading(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <div className="container my-4 p-4 bg-light rounded-3 shadow-sm">
        <div className="d-md-flex align-items-center justify-content-between mb-4">
          <div>
            <h3 className="fw-bold text-dark mb-1">User Management</h3>
            <p className="text-muted small">Monitor user roles, and account status</p>
          </div>

          {/* Search and Filter Bar */}
          <FilterBar
            search={search}
            setSearch={setSearch}
            filterValue={role}
            setFilterValue={setRole}
            activeFilterValue={isActive}
            setActiveFilterValue={setIsActive}
            totalResults={totalResults}
            setPage={setPage}
            options={statusOptions}
            activeOptions={activeStatusOptions}

            placeholder="Find users..."
          />
        </div>

        {/* Card Grid */}
        <div className="row g-3"> {/* Reduced gap from g-4 to g-3 */}
          {loading ? (
            <div className="col-12 text-center py-5">
              <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
              <p className="mt-2 small text-muted">Fetching User data...</p>
            </div>
          ) : users.length > 0 ? (
            users.map((user) => (
              <div key={user._id} className="col-12 col-md-6 col-lg-3"> {/* Changed to col-lg-3 to fit 4 cards per row */}
                <div className="card h-100 border shadow-sm position-relative">

                  {/* Options Button - Smaller padding */}
                  <div className="dropdown position-absolute top-0 end-0 p-1">
                    <button
                      className="btn btn-sm btn-light py-0 px-1 border-0"
                      data-bs-toggle="dropdown"
                    >
                      <i className="bi bi-three-dots-vertical"></i>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end shadow-sm small">
                      <li>
                        {user.isActive ? (
                          <button className="dropdown-item" onClick={() => handleUserActivation(user.isActive, user._id)}>
                            <i className="bi bi-shield-plus me-2"></i>Suspend User</button>
                        ) : (
                          <button className="dropdown-item" onClick={() => handleUserActivation(user.isActive, user._id)}> <i className="bi bi-shield-minus me-2"></i>Activate User</button>
                        )}
                      </li>
                      <li>{user.role === 'admin' ? (
                        <button className="dropdown-item" onClick={() => handleUserRole(user.role, user._id)}>
                          <i className="bi bi-x-circle me-2"></i>Remove Admin</button>
                      ) : (
                        <button className="dropdown-item" onClick={() => handleUserRole(user.role, user._id)}>
                          <i className="bi bi-person-badge me-2"></i>Make Admin</button>)}</li>

                      <li><hr className="dropdown-divider" /></li>

                      <li><button className="dropdown-item text-danger"
                        onClick={() => {
                          setSelectedIds([user._id]);
                          setDeleteUserName(user.username);
                          setShowDeleteModal(true);
                        }}
                      > <i className="bi bi-trash me-2"></i>Delete User</button></li>
                    </ul>
                  </div>

                  <div className="card-body text-center pt-3 pb-2"> {/* Reduced padding */}
                    <img
                      src={user.profilePic || (user.gender === 'male' ? maleProfilePic : user.gender === 'female' ? femaleProfilePic : othersProfilePic)}
                      className="rounded-circle mb-2 shadow-sm border border-2 border-white"
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }} // Shrunk from 80px to 50px
                      alt={user.username}
                    />

                    <h6 className="fw-bold mb-0 text-truncate px-2">{user.username}</h6>
                    <p className="mb-2" style={{ fontSize: '0.75rem' }}>
                      <span className={`badge mt-2 ${user.role === 'admin' ? 'bg-primary' : 'bg-light text-dark border'}`}>
                        {user.role}
                      </span>
                    </p>
                    {!user.isActive && (
                      <div className="small text-muted">
                        <i className="bi bi-shield-fill-plus text-danger me-1"></i>
                        Suspended
                      </div>
                    )}

                    {/* Stats Section - Much more compact */}
                    <div className="row g-0 mt-2 border-top pt-2">
                      <div className="col-4 border-end">
                        <div className="text-muted" style={{ fontSize: '0.65rem' }}>TOTAL</div>
                        <div className="fw-bold small">{user.totalTasks}</div>
                      </div>
                      <div className="col-4 border-end">
                        <div className="text-muted" style={{ fontSize: '0.65rem' }}>VERIFIED</div>
                        <div className="fw-bold small text-info">{user.verifiedTasks}</div>
                      </div>
                      <div className="col-4">
                        <div className="text-muted" style={{ fontSize: '0.65rem' }}>DONE</div>
                        <div className="fw-bold small text-success">{user.completedTasks}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <p className="text-muted small">No users found matching "{search}"</p>
            </div>
          )}
        </div>

        {/* Pagination Component */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <Pagination
              page={page}
              setPage={setPage}
              totalPages={totalPages}
            />
          </div>
        )}
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        loading={delLoading}
        icon="⚠️"
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmUserDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete"
        subMessage={`${deleteUserName} Account ?`}
        smallSubMessage="This will permanently delete the user and all their tasks."
        cancelText={<>Cancel <i className="bi bi-x-lg ms-1"></i></>}
        confirmText={<> Yes, Delete <i className="bi bi-trash ms-1"></i></>}
        confirmBtnClass="btn-danger"
      />

    </>
  );
};

export default UserManagement;