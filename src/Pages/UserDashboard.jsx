import { useState } from "react";
import { useLoaderData } from "react-router";
import Navbar from "../components/Navbar";

const UserDashboard = () => {

    const userData = useLoaderData();
    const [user] = useState(userData.user);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
        </div>
    )
}

export default UserDashboard;