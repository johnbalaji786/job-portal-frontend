import { createBrowserRouter, RouterProvider } from "react-router"
import { ToastContainer } from "react-toastify";
import Home from "./Pages/Home";
import Register from "./Pages/Register";
import store from "./redux/store";
import { Provider } from "react-redux";
import Login from "./Pages/Login";
import RecruiterDashboard from "./Pages/RecruiterDashboard";
import UserDashboard from "./Pages/UserDashboard";
import AdminDashboard from "./Pages/AdminDashboard";
import authLoader from "./loaders/authLoader";
import { adminLoader, recruiterLoader, userLoader } from "./loaders/roleLoaders"; 
import JobDetails from "./Pages/JobDetails";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    loader: authLoader,
      hydrateFallbackElement: <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
  },
    {
    path: "/job/:jobId",
    element: <JobDetails />,
    loader: authLoader,
    hydrateFallbackElement: <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/recruiter/dashboard",
    element: <RecruiterDashboard />,
    loader: recruiterLoader,
       hydrateFallbackElement: <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
  },
  {
    path: "/dashboard",
    element: <UserDashboard />,
    loader: userLoader,
       hydrateFallbackElement: <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
  },
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
    loader: adminLoader,
       hydrateFallbackElement: <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
  },
]);

export const App = () => {
  return (
    <Provider store={store}>
    <RouterProvider router={router} />
     <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Provider>
  
  )
}

export default App
