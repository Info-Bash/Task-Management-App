import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import API from "../../api/api";
import Nav from "../../components/general/nav";
import PageHeader from "../../components/general/header";
import ProfileSidebar from "../../components/general/profileSideBar";
import { CreateTask } from "../../components/user/createTask";
import TaskManager from "../../components/user/taskSection";
import "react-toastify/dist/ReactToastify.css";
import "./userPage.css";


export function UserPage() {
  const {
    userProfile,
    handleUpdateUser,
    logout
  } = useAuth();

  const [showSidebar, setShowSidebar] = useState(false);
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};

  // Task state management
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch user task
  const fetchUserTasks = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/user/tasks`);
      setTasks(res.data.data); setError("");
    } catch (e) {
      console.error("Error fetching user tasks:", e);
      setError("Failed to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserTasks();
  }, []);

  return (
    <>
      {/* Navbar Section */}
      <Nav />

      {/* Header section */}
      <PageHeader
        storedUser={storedUser}
        setShowSidebar={setShowSidebar}
        userProfile={userProfile}
      />

      {/* User Profile Sidebar */}
      <ProfileSidebar
        show={showSidebar}
        handleClose={() => setShowSidebar(false)}
        user={userProfile}
        onSave={handleUpdateUser}
        onLogout={logout}
      />


      {/* Backdrop for the sidebar */}
      {showSidebar && <div className="offcanvas-backdrop fade show" onClick={() => setShowSidebar(false)}></div>}

      {/* Create Task Section  */}
      <CreateTask
        setTasks={setTasks}
      />

      {/* Task Manager Section */}
      <TaskManager
        tasks={tasks}
        setTasks={setTasks}
        loading={loading}
        error={error}
      />
    </>
  );
}