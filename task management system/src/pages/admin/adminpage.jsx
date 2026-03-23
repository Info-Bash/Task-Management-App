import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import Nav from "../../components/general/nav";
import PageHeader from "../../components/general/header";
import ProfileSidebar from "../../components/general/profileSideBar";
import UserManagement from "../../components/admin/userManagement";
import AdminTaskManager from "../../components/admin/adminTaskManagemengt";

function AdminPage() {
  const {
        userProfile,
        handleUpdateUser,
        logout
      } = useAuth();
      
  const [showSidebar, setShowSidebar] = useState(false);
  /* const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  }); */
  //const [userProfile, setUserProfile] = useState(null);

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
        const res = await API.get(`/admin/profile/${user._id}`);
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
    const res = await API.put(`/admin/update-profile/${user._id}`, updatedData);

    const updatedUser = res.data.user;
    setUserProfile(updatedUser);

    return res.data; // success only
  }; */

  // Log out user
  /* const handleLogout = () => {
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

      {showSidebar && <div className="offcanvas-backdrop fade show" onClick={() => setShowSidebar(false)}></div>}

      {/* All Users Section */}
        <UserManagement />
      
      {/* All users tasks section */}
      <AdminTaskManager />
    </>
  );
}

export default AdminPage;