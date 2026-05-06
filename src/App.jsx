import { createBrowserRouter, RouterProvider } from "react-router"
import { ToastContainer } from "react-toastify";
import Home from "./Pages/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
]);

export const App = () => {
  return (
    <>
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
    </>
  
  )
}

export default App
