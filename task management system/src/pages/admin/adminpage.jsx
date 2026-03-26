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

  const storedUser = JSON.parse(localStorage.getItem("user")) || {};


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