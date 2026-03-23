import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
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
  } = useAuth()

  const [showSidebar, setShowSidebar] = useState(false);

  const [tasks, setTasks] = useState([]);

  //const navigate = useNavigate();

  /* useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/user/me");
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
  }, [navigate]); */


  /* useEffect(() => {
    if (!user || !user._id) return;
    const fetchUserProfile = async () => {
      try {
        const res = await API.get(`/user/profile/${user._id}`);
        setUserProfile(res.data.user);
      } catch (e) {
        console.log("Error fetching user profile:", e);
      }
    }

    fetchUserProfile();

  }, [user]); */

  const storedUser = JSON.parse(localStorage.getItem("user")) || {};

  /* User profile Update  */
  /* const handleUpdateUser = async (updatedData) => {
    const res = await API.put(`/user/update-profile/${user._id}`, updatedData);

    const updatedUser = res.data.user;
    setUserProfile(updatedUser);

    return res.data; // success only
  }; */

  /* // Log out user
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setUserProfile(null);

    navigate("/login");
  }; */


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
      />
    </>
  );
}