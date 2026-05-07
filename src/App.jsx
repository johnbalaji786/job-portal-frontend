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

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
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
  },
  {
    path: "/dashboard",
    element: <UserDashboard />,
  },
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
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
