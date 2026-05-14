import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import { getAllJobs } from "../services/jobServices";
import { toast } from "react-toastify";

const Home = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useState({
        search: '',
        location: '',
        jobType: '',
        experienceLevel: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchJobs();
    }, [currentPage]);

    const fetchJobs = async (filters = searchParams) => {
        try {
            setLoading(true);
            const params = {
                page: currentPage,
                limit: 12,
                ...filters
            };

            // Remove empty filters
            Object.keys(params).forEach(key => {
                if (!params[key]) delete params[key];
            });

          const response = await getAllJobs(params);
             console.log(response);
            setJobs(response.jobs || []);
            setTotalPages(response.totalPages || 1);
        } catch (error) {
            toast.error('Failed to fetch jobs.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchJobs();
    };

    const handleJobClick = (jobId) => {
        navigate(`/job/${jobId}`);
    };

    const formatSalary = (salary) => {
        if (!salary) return 'Salary not specified';

        // Handle string salary (legacy format)
        if (typeof salary === 'string') {
            return salary;
        }

        // Handle object salary with min/max
        if (typeof salary === 'object') {
            const { min, max, currency = 'USD' } = salary;
            if (min && max) {
                return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
            } else if (min) {
                return `${currency} ${min.toLocaleString()}+`;
            } else if (max) {
                return `Up to ${currency} ${max.toLocaleString()}`;
            }
        }

        return 'Salary not specified';
    };

    const getJobTypeColor = (type) => {
        const colors = {
            'Full-time': 'bg-blue-100 text-blue-800',
            'Part-time': 'bg-green-100 text-green-800',
            'Contract': 'bg-yellow-100 text-yellow-800',
            'Freelance': 'bg-purple-100 text-purple-800',
            'Internship': 'bg-pink-100 text-pink-800'
        };
        return colors[type] || 'bg-gray-100 text-gray-800';
    };

    const getExperienceColor = (level) => {
        const colors = {
            'Entry': 'bg-green-100 text-green-800',
            'Junior': 'bg-blue-100 text-blue-800',
            'Mid': 'bg-yellow-100 text-yellow-800',
            'Senior': 'bg-orange-100 text-orange-800',
            'Lead': 'bg-purple-100 text-purple-800',
            'Executive': 'bg-red-100 text-red-800'
        };
        return colors[level] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            <Navbar />

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        Find Your Dream Job
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 text-blue-100">
                        Discover thousands of job opportunities from top companies
                    </p>

                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-lg p-4 shadow-lg">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <input
                                    type="text"
                                    placeholder="Job title, keywords..."
                                    value={searchParams.search}
                                    onChange={(e) => setSearchParams({ ...searchParams, search: e.target.value })}
                                    className="px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Location"
                                    value={searchParams.location}
                                    onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                                    className="px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <select
                                    value={searchParams.jobType}
                                    onChange={(e) => setSearchParams({ ...searchParams, jobType: e.target.value })}
                                    className="px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Job Types</option>
                                    <option value="Full-time">Full Time</option>
                                    <option value="Part-time">Part Time</option>
                                    <option value="Contract">Contract</option>
                                    <option value="Freelance">Freelance</option>
                                    <option value="Internship">Internship</option>
                                </select>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold"
                                >
                                    Search Jobs
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Jobs Section */}
            <div className="container mx-auto px-4 py-12">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">
                        Latest Jobs
                    </h2>
                    <div className="flex items-center gap-4">
                        <select
                            value={searchParams.experienceLevel}
                            onChange={(e) => {
                                setSearchParams({ ...searchParams, experienceLevel: e.target.value });
                                setCurrentPage(1);
                                fetchJobs({ ...searchParams, experienceLevel: e.target.value });
                            }}
                            className="px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Experience Levels</option>
                            <option value="Entry">Entry Level</option>
                            <option value="Junior">Junior Level</option>
                            <option value="Mid">Mid Level</option>
                            <option value="Senior">Senior Level</option>
                            <option value="Lead">Lead Level</option>
                            <option value="Executive">Executive Level</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="text-center py-20">
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No jobs found</h3>
                        <p className="text-gray-500">Try adjusting your search criteria</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {jobs.map((job) => (
                                <div
                                    key={job._id}
                                    onClick={() => handleJobClick(job._id)}
                                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 cursor-pointer border border-gray-100 hover:border-blue-200"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">
                                                {job.title}
                                            </h3>
                                            <p className="text-blue-600 font-medium mb-1">
                                                {job.company?.name}
                                            </p>
                                            <p className="text-gray-600 text-sm">
                                                📍 {job.location}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                                        {job.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getJobTypeColor(job.jobType)}`}>
                                            {job.jobType}
                                        </span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getExperienceColor(job.experienceLevel)}`}>
                                            {job.experienceLevel}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="text-green-600 font-semibold">
                                            {formatSalary(job.salary)}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {new Date(job.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>

                                    {job.skills && job.skills.length > 0 && (
                                        <div className="mt-3 pt-3 border-t border-gray-100">
                                            <div className="flex flex-wrap gap-1">
                                                {job.skills.slice(0, 3).map((skill, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                                {job.skills.length > 3 && (
                                                    <span className="text-xs text-gray-500 px-2 py-1">
                                                        +{job.skills.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-12">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        Previous
                                    </button>

                                    {[...Array(totalPages)].map((_, index) => {
                                        const page = index + 1;
                                        if (
                                            page === 1 ||
                                            page === totalPages ||
                                            (page >= currentPage - 1 && page <= currentPage + 1)
                                        ) {
                                            return (
                                                <button
                                                    key={page}
                                                    onClick={() => setCurrentPage(page)}
                                                    className={`px-4 py-2 border rounded-lg ${currentPage === page
                                                        ? 'bg-blue-600 text-white border-blue-600'
                                                        : 'hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {page}
                                                </button>
                                            );
                                        } else if (
                                            page === currentPage - 2 ||
                                            page === currentPage + 2
                                        ) {
                                            return <span key={page} className="px-2 py-2">...</span>;
                                        }
                                        return null;
                                    })}

                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Home;