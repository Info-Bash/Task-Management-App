import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";
import ProfileSidebar from "../../components/general/profileSideBar";
import { CreateTask } from "../../components/user/createTask";
import TaskManager from "../../components/general/taskSection";
import "react-toastify/dist/ReactToastify.css";
import "./userPage.css";


export function UserPage() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [userProfile, setUserProfile] = useState(null);

  const [tasks, setTasks] = useState([
    /* { id: 1, title: "Create Website", desc: "Build a responsive wordpress site using Elementor pro and custom CSS", dateCreated: "2023-10-01", dateCompleted: null, status: 'pending' },
    { id: 2, title: "Beta Reading", desc: "Read through the fantasy novel and provide feedback on pacing and world building", dateCreated: "2023-10-05", dateCompleted: '2023-10-34', status: 'completed' },
    { id: 3, title: "Beta Reading 3", desc: "Read through the fantasy novel and provide feedback on pacing and world building", dateCreated: "2023-10-05", dateCompleted: '2023-10-07', status: 'completed' },
    { id: 4, title: "Beta Reading 4", desc: "Read through the fantasy novel and provide feedback on pacing and world building", dateCreated: "2023-10-05", dateCompleted: '2023-10-06', status: 'completed' },
    { id: 5, title: "Beta Reading 5", desc: "Read through the fantasy novel and provide feedback on pacing and world building", dateCreated: "2023-10-05", dateCompleted: null, status: 'pending' },
    { id: 6, title: "Beta Reading 6", desc: "Read through the fantasy novel and provide feedback on pacing and world building", dateCreated: "2023-10-05", dateCompleted: '2023-10-07', status: 'completed' },
    { id: 7, title: "Beta Reading 7", desc: "Read through the fantasy novel and provide feedback on pacing and world building", dateCreated: "2023-10-05", dateCompleted: null, status: 'pending' },
    { id: 8, title: "Beta Reading 8", desc: "Read through the fantasy novel and provide feedback on pacing and world building", dateCreated: "2023-10-05", dateCompleted: null, status: 'pending' },
    { id: 9, title: "Beta Reading 9", desc: "Read through the fantasy novel and provide feedback on pacing and world building", dateCreated: "2023-10-05", dateCompleted: '2023-10-08', status: 'completed' },
    { id: 10, title: "Beta Reading 10", desc: "Read through the fantasy novel and provide feedback on pacing and world building", dateCreated: "2023-10-05", dateCompleted: null, status: 'pending' },
    { id: 11, title: "Beta Reading 11", desc: "Read through the fantasy novel and provide feedback on pacing and world building", dateCreated: "2023-10-05", dateCompleted: null, status: 'pending' },
    { id: 12, title: "Beta Reading 12", desc: "Read through the fantasy novel and provide feedback on pacing and world building", dateCreated: "2023-10-05", dateCompleted: '2023-10-09', status: 'completed' },
    { id: 13, title: "Beta Reading 13", desc: "Read through the fantasy novel and provide feedback on pacing and world building", dateCreated: "2023-10-05", dateCompleted: null, status: 'pending' },
    { id: 14, title: "Beta Reading 14", desc: "Read through the fantasy novel and provide feedback on pacing and world building", dateCreated: "2023-10-05", dateCompleted: null, status: 'pending' },
    { id: 15, title: "Beta Reading 15", desc: "Read through the fantasy novel and provide feedback on pacing and world building", dateCreated: "2023-10-05", dateCompleted: '2023-10-10', status: 'completed', verified: true, dateVerified: '2023-10-12' }, */
    // Add more mock data to test scrolling...
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/me");
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      } catch (err) {
        console.error("Not authenticated", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);


  useEffect(() => {
    if (!user || !user._id) return;
    const fetchUserProfile = async () => {
      try {
        const res = await API.get(`/profile/${user._id}`);
        setUserProfile(res.data.user);
      } catch (e) {
        console.log("Error fetching user profile:", e);
      }
    }

    fetchUserProfile();

  }, [user]);

  const storedUser = JSON.parse(localStorage.getItem("user")) || {};

  /* User profile Update  */
  const handleUpdateUser = async (updatedData) => {
    const res = await API.put(`/update-profile/${user._id}`, updatedData);

    const updatedUser = res.data.user;
    setUserProfile(updatedUser);

    return res.data; // success only
  };

  // Log out user
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setUserProfile(null);

    navigate("/login");
  };


  return (
    <>
      {/* Navbar Section */}
      <nav className="navbar p-0 bg-body-tertiary">
        <div className="container">
          <div className="navbar-brand justify-content-center d-flex align-items-center">
            <i className="bi bi-list-task text-center me-3" style={{ fontSize: '2rem' }}></i>
            Tasks Management
          </div>
        </div>
      </nav>

      {/* Header section */}
      <nav className="navbar p-0 navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid bg-primary text-white p-2">
          <div className="container d-flex justify-content-between align-items-center">
            <h2 className="navbar-brand text-white m-0">Welcome {storedUser.username ? storedUser.username.charAt(0).toUpperCase() + storedUser.username.slice(1) : "User"}</h2>
            <img
              className="rounded-circle"
              style={{ cursor: 'pointer' }}
              width="40" height="40"
              src="/images/profile-icon-isolated-on-grey-260nw-1642562347.webp"
              alt="profile"
              onClick={() => setShowSidebar(true)}
            />
          </div>
        </div>
      </nav>

      {/* User Profile Sidebar */}
      <ProfileSidebar
        show={showSidebar}
        handleClose={() => setShowSidebar(false)}
        user={userProfile}
        onSave={handleUpdateUser}
        onLogout={handleLogout}
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
      />
    </>
  );
}