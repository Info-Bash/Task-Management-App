import { useState, useEffect } from 'react';
import { Outlet, useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Nav from '../../components/general/nav';
import PageHeader from '../../components/general/header';
import TaskSidebar from './taskSidebar';
import API from '../../api/api';

export function TaskLayout() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState()
  const { userProfile } = useAuth();

  const storedUser = JSON.parse(localStorage.getItem("user")) || {};

  const getSingleTask = async (id) => {
    try {
      const response = await API.get(`/user/task/${id}`);
      return { data: response.data, error: null };
    } catch (error) {
      const message =
        error.response?.data?.message || "Something went wrong";

      console.error("Error fetching single task:", message);

      return { data: null, error: message };
    }
  };

  useEffect(() => {
    const fetchTask = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await getSingleTask(id);

      if (error) {
        setError(error);
      } else {
        setTask(data.data);
      }

      setLoading(false);
    };

    if (id) fetchTask();
  }, [id]);

  return (
    <>
      <Nav />
      <PageHeader
        storedUser={storedUser}
        userProfile={userProfile}
        clickable={false} />

      <main className="bg-light min-vh-100">
        {/* Action Bar / Breadcrumb */}
        <div className="border-bottom bg-white py-3">
          <div className="container">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <a href="#" onClick={() => navigate(-1)}
                    className="text-decoration-none text-muted">
                    Dashboard
                  </a>
                </li>
                <li className="breadcrumb-item active fw-bold">Task Details</li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="container py-5">
          <div className="row">
            <div className="col-lg-8">
              {/* This 'context' prop shares data with ViewTask and EditTask */}
              <Outlet context={{ task, setTask, loading, error }} />
            </div>
            <TaskSidebar task={task} loading={loading} />
          </div>
        </div>
      </main>
    </>
  );
}