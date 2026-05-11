import { Navigate, useLoaderData } from "react-router";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAllCompanies, getAllRecruiters } from "../services/adminServices";

const AdminDashboard = () => {
    const userData = useLoaderData();
    const [user] = useState(userData.user);

    const [companies, setCompanies] = useState(0);
    const [recruiters, setRecruiters] = useState(0);
    const [activeTab, setActiveTab] = useState('companies');
    const [loading, setLoading] = useState(false);

    if (user.role !== 'admin') {
        toast.error('Unauthorized access. Admins only.');

        if (user.role === 'recruiter') {
            return <Navigate to="/recruiter-dashboard" replace />;
        } else if (user.role === 'user') {
            return <Navigate to="/dashboard" replace />;
        }

        return <Navigate to="/login" replace />;
    }

    const fetchData = async () => {
        // get the companies data
        // get the recruiters data
        try {
            setLoading(true);

            const [companiesRes, recruitersRes] = await Promise.all([
                getAllCompanies(),
                getAllRecruiters()
            ]);

            setCompanies(companiesRes.companies || []);
            setRecruiters(recruitersRes.recruiters || []);
        } catch (error) {
            toast.error('Failed to fetch data. Please try again later.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user.role !== 'admin') {
            toast.error('Unauthorized access. Admins only.');
            return;
        }

        fetchData();
    }, [user]);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

                {/* Tab Navigation */}
                <div className="mb-8">
                    <nav className="flex space-x-8">
                        <button
                            onClick={() => setActiveTab('companies')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'companies'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Companies ({companies.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('recruiters')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'recruiters'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Recruiters ({recruiters.length})
                        </button>
                    </nav>
                </div>
            </div>
        </div >
    )
}

export default AdminDashboard;