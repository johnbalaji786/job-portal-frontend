import { useEffect, useState } from "react";
import { useParams, useNavigate, useLoaderData } from "react-router";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import { getJobById, applyForJob } from "../services/jobServices";

const JobDetails = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const userData = useLoaderData();
    const [user] = useState(userData.user);

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const [coverLetter, setCoverLetter] = useState('');

    useEffect(() => {
        fetchJobDetails();
    }, [jobId]);

    const fetchJobDetails = async () => {
        try {
            setLoading(true);
            const response = await getJobById(jobId);
            setJob(response.job);
        } catch (error) {
            toast.error('Failed to fetch job details.');
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const handleApplyClick = () => {
        if (!user) {
            toast.info('Please login to apply for jobs.');
            navigate('/login');
            return;
        }

        if (user.role !== 'user') {
            toast.error('Only job seekers can apply for jobs.');
            return;
        }

        setShowApplicationForm(true);
    };

    const handleSubmitApplication = async (e) => {
        e.preventDefault();
        try {
            setApplying(true);
            await applyForJob(jobId, { coverLetter });
            toast.success('Application submitted successfully!');
            setShowApplicationForm(false);
            setCoverLetter('');
            fetchJobDetails(); // Refresh to update application status
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit application');
        } finally {
            setApplying(false);
        }
    };

    const formatSalary = (salary) => {
        if (!salary) return 'Salary not disclosed';

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

        return 'Salary not disclosed';
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

    const isApplicationDeadlinePassed = () => {
        if (!job?.applicationDeadline) return false;
        return new Date() > new Date(job.applicationDeadline);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="container mx-auto px-4 py-20 text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Job Not Found</h1>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Back to Jobs
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 flex items-center text-gray-600 hover:text-gray-800"
                >
                    ← Back to Jobs
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-md p-8">
                            {/* Job Header */}
                            <div className="mb-6">
                                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                    {job.title}
                                </h1>
                                <div className="flex items-center gap-4 text-gray-600 mb-4">
                                    <span className="font-semibold text-blue-600">
                                        {job.company?.name}
                                    </span>
                                    <span>{job.location}</span>
                                    <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getJobTypeColor(job.jobType)}`}>
                                        {job.jobType}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getExperienceColor(job.experienceLevel)}`}>
                                        {job.experienceLevel}
                                    </span>
                                    {job.isRemote && (
                                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                                            Remote
                                        </span>
                                    )}
                                </div>

                                <div className="text-2xl font-bold text-green-600 mb-4">
                                    {formatSalary(job.salary)}
                                </div>
                            </div>

                            {/* Job Description */}
                            <div className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">Job Description</h2>
                                <div className="prose prose-gray max-w-none">
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {job.description}
                                    </p>
                                </div>
                            </div>

                            {/* Requirements */}
                            <div className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">Requirements</h2>
                                <div className="prose prose-gray max-w-none">
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {job.requirements}
                                    </p>
                                </div>
                            </div>

                            {/* Skills */}
                            {job.skills && job.skills.length > 0 && (
                                <div className="mb-8">
                                    <h2 className="text-xl font-semibold mb-4">Required Skills</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {job.skills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Company Info */}
                            {job.company && (
                                <div>
                                    <h2 className="text-xl font-semibold mb-4">About the Company</h2>
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <h3 className="font-semibold text-lg mb-2">{job.company.name}</h3>
                                        {job.company.industry && (
                                            <p className="text-gray-600 mb-2">Industry: {job.company.industry}</p>
                                        )}
                                        {job.company.size && (
                                            <p className="text-gray-600 mb-2">Company Size: {job.company.size}</p>
                                        )}
                                        {job.company.description && (
                                            <p className="text-gray-700">{job.company.description}</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                            <h3 className="text-lg font-semibold mb-4">Job Summary</h3>

                            <div className="space-y-3 mb-6">
                                <div>
                                    <span className="text-gray-600">Job Type:</span>
                                    <span className="float-right font-medium">{job.jobType}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Experience:</span>
                                    <span className="float-right font-medium">{job.experienceLevel}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Location:</span>
                                    <span className="float-right font-medium">{job.location}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Salary:</span>
                                    <span className="float-right font-medium text-green-600">
                                        {formatSalary(job.salary)}
                                    </span>
                                </div>
                                {job.applicationDeadline && (
                                    <div>
                                        <span className="text-gray-600">Deadline:</span>
                                        <span className="float-right font-medium">
                                            {new Date(job.applicationDeadline).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}
                                <div>
                                    <span className="text-gray-600">Applications:</span>
                                    <span className="float-right font-medium">{job.applicationsCount || 0}</span>
                                </div>
                            </div>

                            {/* Apply Button and Form */}
                            {user && user.role === 'user' && (
                                <>
                                    {!showApplicationForm && (
                                        <button
                                            onClick={handleApplyClick}
                                            disabled={!job.isActive || isApplicationDeadlinePassed()}
                                            className={`w-full py-3 px-4 rounded-lg font-semibold transition duration-200 ${job.isActive && !isApplicationDeadlinePassed()
                                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                }`}
                                        >
                                            {!job.isActive
                                                ? 'Job No Longer Active'
                                                : isApplicationDeadlinePassed()
                                                    ? 'Application Deadline Passed'
                                                    : 'Apply Now'
                                            }
                                        </button>
                                    )}

                                    {/* Inline Application Form */}
                                    {showApplicationForm && (
                                        <div className="border-t pt-6 mt-6">
                                            <h3 className="text-lg font-semibold mb-4">Apply for {job.title}</h3>
                                            <form onSubmit={handleSubmitApplication} className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Cover Letter
                                                    </label>
                                                    <textarea
                                                        value={coverLetter}
                                                        onChange={(e) => setCoverLetter(e.target.value)}
                                                        placeholder="Tell us why you're perfect for this role..."
                                                        className="w-full p-3 border border-gray-300 rounded-lg h-32 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        required
                                                    />
                                                </div>
                                                <div className="flex gap-3">
                                                    <button
                                                        type="submit"
                                                        disabled={applying}
                                                        className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
                                                    >
                                                        {applying ? 'Submitting...' : 'Submit Application'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setShowApplicationForm(false);
                                                            setCoverLetter('');
                                                        }}
                                                        className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    )}
                                </>
                            )}

                            {!user && (
                                <button
                                    onClick={() => navigate('/login')}
                                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
                                >
                                    Login to Apply
                                </button>
                            )}

                            {user && user.role !== 'user' && (
                                <div className="text-center text-gray-500 py-3">
                                    Only job seekers can apply
                                </div>
                            )}

                            {/* Share */}
                            <div className="mt-6 pt-6 border-t">
                                <h4 className="font-semibold mb-3">Share this job</h4>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(window.location.href);
                                            toast.success('Link copied to clipboard!');
                                        }}
                                        className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded hover:bg-gray-200 text-sm"
                                    >
                                        Copy Link
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetails;