import { toast } from "react-toastify"

import Navbar from "../components/navbar"

const Home = () => {

    //toast.success("Welcome to Job Portal");
    
    return (

          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            <Navbar />
        </div>
    
  )
}

export default Home
