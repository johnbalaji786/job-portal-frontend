import { Navigate, useLoaderData, useNavigate } from 'react-router';
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getMyApplications } from "../services/jobServices";

const UserDashboard = () => {
    const userData = useLoaderData();
    const [user] = useState(userData.user);
    const navigate = useNavigate();

    if (user.role !== 'user') {
        toast.error('Access denied. Users only.');

        if (user.role === 'admin') {
            return <Navigate to={'/admin-dashboard'} replace />;
        } else if (user.role === 'recruiter') {
            return <Navigate to={'/recruiter-dashboard'} replace />;
        }

        return <Navigate to={'/login'} replace />;
    }

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('applications');

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const response = await getMyApplications();

            setApplications(response.applications || []);
        } catch (error) {
            toast.error('Failed to fetch applications.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'reviewing': 'bg-blue-100 text-blue-800',
            'shortlisted': 'bg-green-100 text-green-800',
            'rejected': 'bg-red-100 text-red-800',
            'hired': 'bg-purple-100 text-purple-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusText = (status) => {
        const statusText = {
            'pending': 'Pending',
            'reviewing': 'Under Review',
            'shortlisted': 'Shortlisted',
            'rejected': 'Rejected',
            'hired': 'Hired'
        };
        return statusText[status] || status;
    };

    const handleViewJob = (jobId) => {
        navigate(`/job/${jobId}`);
    };

    const stats = {
        total: applications.length,
        pending: applications.filter(app => app.status === 'pending').length,
        reviewing: applications.filter(app => app.status === 'reviewing').length,
        shortlisted: applications.filter(app => app.status === 'shortlisted').length,
        rejected: applications.filter(app => app.status === 'rejected').length,
        hired: applications.filter(app => app.status === 'hired').length
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Welcome back, {user.name}!
                    </h1>
                    <p className="text-gray-600">
                        Track your job applications and discover new opportunities
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
                        <div className="text-sm text-gray-600">Total Applications</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                        <div className="text-sm text-gray-600">Pending</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="text-2xl font-bold text-blue-600">{stats.reviewing}</div>
                        <div className="text-sm text-gray-600">Under Review</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="text-2xl font-bold text-green-600">{stats.shortlisted}</div>
                        <div className="text-sm text-gray-600">Shortlisted</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                        <div className="text-sm text-gray-600">Rejected</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="text-2xl font-bold text-purple-600">{stats.hired}</div>
                        <div className="text-sm text-gray-600">Hired</div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
                        >
                            Browse Jobs
                        </button>
                        <button
                            onClick={() => window.open('/profile', '_blank')}
                            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-200"
                        >
                            Update Profile
                        </button>
                        <button
                            onClick={() => window.open('/resume', '_blank')}
                            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition duration-200"
                        >
                            Upload Resume
                        </button>
                    </div>
                </div>

                {/* Applications Section */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-semibold">My Applications</h2>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : applications.length === 0 ? (
                        <div className="text-center py-20">
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">No applications yet</h3>
                            <p className="text-gray-500 mb-6">Start applying to jobs to see them here</p>
                            <button
                                onClick={() => navigate('/')}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                            >
                                Browse Jobs
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Job Details
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Company
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Applied Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {applications.map((application) => (
                                        <tr key={application._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {application.job?.title || 'Job Title Unavailable'}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {application.job?.location || 'Location not specified'}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {application.job?.jobType && application.job?.experienceLevel
                                                            ? `${application.job.jobType} • ${application.job.experienceLevel}`
                                                            : application.job?.jobType || application.job?.experienceLevel || 'Job details not available'
                                                        }
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {application.job?.company?.name || 'Company Unavailable'}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {application.job?.company?.industry || ''}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(application.appliedAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(application.status)}`}>
                                                    {getStatusText(application.status)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => handleViewJob(application.job?._id)}
                                                    className="text-blue-600 hover:text-blue-900 mr-4"
                                                    disabled={!application.job?._id}
                                                >
                                                    View Job
                                                </button>
                                                {application.coverLetter && (
                                                    <button
                                                        onClick={() => {
                                                            alert(`Cover Letter:${application.coverLetter}`);
                                                        }}
                                                        className="text-green-600 hover:text-green-900"
                                                    >
                                                        View Cover Letter
                                                    </button>
                                                )}                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Recent Activity */}
                {applications.length > 0 && (
                    <div className="mt-8 bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                        <div className="space-y-4">
                            {applications
                                .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
                                .slice(0, 5)
                                .map((application) => (
                                    <div key={application._id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                        <div className="flex-shrink-0">
                                            <div className={`w-3 h-3 rounded-full ${application.status === 'hired' ? 'bg-purple-500' :
                                                application.status === 'shortlisted' ? 'bg-green-500' :
                                                    application.status === 'reviewing' ? 'bg-blue-500' :
                                                        application.status === 'rejected' ? 'bg-red-500' :
                                                            'bg-yellow-500'
                                                }`}></div>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-900">
                                                Applied for <strong>{application.job?.title}</strong> at{' '}
                                                <strong>{application.job?.company?.name}</strong>
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(application.appliedAt).toLocaleDateString()} • Status: {getStatusText(application.status)}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;