import { useEffect, useState } from "react";
import { AuthContext } from "./authContext";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import { setupInterceptors } from "../api/interceptors";

const AuthProvider = ({ children }) => {

  // use api interceptor
  useEffect(() => {
    const initAuth = async () => {
      setupInterceptors(logout);
      await fetchUser();
    };

    initAuth();
  }, []);

  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  // fetch user and stores user 
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setUser(null);
        return;
      }

      const res = await API.get("/user/me");
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));

    } catch (err) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      console.error("Fetch User Error: ", err);
    } finally {
      setLoading(false);
    }
  };


  // login logic
  const login = async (formData, from) => {
    try {
      setLoading(true);

      const res = await API.post("/auth/login", formData);

      // Save token
      localStorage.setItem("token", res.data.accessToken);

      // Fetch user
      const me = await API.get("/user/me");

      localStorage.setItem("user", JSON.stringify(me.data.user));
      setUser(me.data.user);

      //select fall backe base on loged in user role
      const fallback = me.data.user.role === "admin"
        ? "/admin-dashboard"
        : "/user-dashboard";

      // destination from either the uselatation if exist or the fallback
      const destination = from || fallback;

      // Navigate to the right page
      // small delay ensures state sync (optional)
      setTimeout(() => {
        navigate(destination, { replace: true });
      }, 0);

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
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

  }, [user]);


  /* User profile Update  */
  const handleUpdateUser = async (updatedData) => {
    const res = await API.put(`/user/update-profile/${user._id}`, updatedData);

    const updatedUser = res.data.user;
    setUserProfile(updatedUser);

    return res.data; // success only
  };


  // logout logic
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={
      {
        user,
        userProfile,
        loading,
        login,
        handleUpdateUser,
        logout
      }
    }>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;