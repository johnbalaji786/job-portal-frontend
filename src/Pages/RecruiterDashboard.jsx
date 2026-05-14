import { useLoaderData,Navigate } from "react-router";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { createJob, deleteJob, getJobApplications, getMyJobs, updateApplicationStatus, updateJob } from "../services/jobServices";
import { toast } from "react-toastify";

const RecruiterDashboard = () => {
    const userData = useLoaderData();
    const [user] = useState(userData.user);

    if (user.role !== 'recruiter') {
        toast.error('Access denied. Recruiters only.');

        if (user.role === 'admin') {
            return <Navigate to={'/admin-dashboard'} replace />;
        } else if (user.role === 'user') {
            return <Navigate to={'/dashboard'} replace />;
        }

        return <Navigate to={'/login'} replace />;
    }

    const [activeTab, setActiveTab] = useState('jobs');
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showJobForm, setShowJobForm] = useState(false);
    const [editingJob, setEditingJob] = useState(null);
    const [selectedJobApplications, setSelectedJobApplications] = useState([]);
    const [showApplicationsSection, setShowApplicationsSection] = useState(false);

    const [jobData, setJobData] = useState({
        title: '',
        description: '',
        requirements: '',
        location: '',
        jobType: 'Full-time',
        experienceLevel: 'Entry',
        salary: '',
        skills: '',
        applicationDeadline: ''
    });

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const response = await getMyJobs();
            console.log(response);
            //setJobs(response.jobs || []);
            setJobs(response?.data || []);
        } catch (error) {
           // toast.error('Failed to fetch jobs.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateJob = async (e) => {
        e.preventDefault();
        try {
            const jobPayload = {
                ...jobData,
                skills: jobData.skills.split(',').map(skill => skill.trim()).filter(skill => skill)
            };

            await createJob(jobPayload);
            toast.success('Job created successfully!');
            setShowJobForm(false);
            resetJobForm();
            fetchJobs();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create job');
        }
    };

    const handleUpdateJob = async (e) => {
        e.preventDefault();
        try {
            const jobPayload = {
                ...jobData,
                skills: jobData.skills.split(',').map(skill => skill.trim()).filter(skill => skill)
            };

            await updateJob(editingJob._id, jobPayload);
            toast.success('Job updated successfully!');
            setShowJobForm(false);
            setEditingJob(null);
            resetJobForm();
            fetchJobs();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update job');
        }
    };

    const handleDeleteJob = async (id) => {
        if (window.confirm('Are you sure you want to delete this job?')) {
            try {
                await deleteJob(id);
                toast.success('Job deleted successfully!');
                fetchJobs();
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to delete job');
            }
        }
    };

    const fetchJobApplications = async (jobId) => {
        try {
            const response = await getJobApplications(jobId);
            setSelectedJobApplications(response.applications || []);
            setShowApplicationsSection(true);
        } catch (error) {
            toast.error('Failed to fetch applications.');
        }
    };

    const handleUpdateApplicationStatus = async (applicationId, status) => {
        try {
            await updateApplicationStatus(applicationId, status);
            toast.success('Application status updated successfully!');
            // Refresh applications
            const jobId = selectedJobApplications.find(app => app._id === applicationId)?.job._id;
            if (jobId) {
                fetchJobApplications(jobId);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update status');
        }
    };

    const resetJobForm = () => {
        setJobData({
            title: '',
            description: '',
            requirements: '',
            location: '',
            jobType: 'Full-time',
            experienceLevel: 'Entry',
            salary: '',
            skills: '',
            applicationDeadline: ''
        });
    };

    const openEditModal = (job) => {
        setEditingJob(job);
        setJobData({
            title: job.title,
            description: job.description,
            requirements: job.requirements,
            location: job.location,
            jobType: job.jobType,
            experienceLevel: job.experienceLevel,
            salary: job.salary || '',
            skills: job.skills ? job.skills.join(', ') : '',
            applicationDeadline: job.applicationDeadline ? new Date(job.applicationDeadline).toISOString().split('T')[0] : ''
        });
        setShowJobForm(true);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Recruiter Dashboard</h1>

                {user.assignedCompany && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                        <h2 className="text-lg font-semibold text-blue-800">
                            {user.assignedCompany.name}
                        </h2>
                    </div>
                )}

                {/* Jobs Section */}
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">My Job Postings</h2>
                        <button
                            onClick={() => setShowJobForm(!showJobForm)}
                            className={`px-4 py-2 rounded transition-colors ${showJobForm
                                ? 'bg-red-600 hover:bg-red-700 text-white'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                        >
                            {showJobForm ? 'Cancel' : 'Post New Job'}
                        </button>
                    </div>

                    {/* Inline Job Form */}
                    {showJobForm && (
                        <div className="bg-white rounded-lg shadow p-6 mb-6">
                            <h3 className="text-lg font-semibold mb-4">
                                {editingJob ? 'Edit Job' : 'Create New Job'}
                            </h3>
                            <form onSubmit={editingJob ? handleUpdateJob : handleCreateJob} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Job Title"
                                        value={jobData.title}
                                        onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Location"
                                        value={jobData.location}
                                        onChange={(e) => setJobData({ ...jobData, location: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <textarea
                                    placeholder="Job Description"
                                    value={jobData.description}
                                    onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32 resize-none"
                                    required
                                />
                                <textarea
                                    placeholder="Requirements"
                                    value={jobData.requirements}
                                    onChange={(e) => setJobData({ ...jobData, requirements: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
                                    required
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <select
                                        value={jobData.jobType}
                                        onChange={(e) => setJobData({ ...jobData, jobType: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="Full-time">Full Time</option>
                                        <option value="Part-time">Part Time</option>
                                        <option value="Contract">Contract</option>
                                        <option value="Freelance">Freelance</option>
                                        <option value="Internship">Internship</option>
                                    </select>
                                    <select
                                        value={jobData.experienceLevel}
                                        onChange={(e) => setJobData({ ...jobData, experienceLevel: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="Entry">Entry Level</option>
                                        <option value="Junior">Junior Level</option>
                                        <option value="Mid">Mid Level</option>
                                        <option value="Senior">Senior Level</option>
                                        <option value="Lead">Lead Level</option>
                                        <option value="Executive">Executive Level</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Salary (e.g., $50,000 - $70,000)"
                                        value={jobData.salary}
                                        onChange={(e) => setJobData({ ...jobData, salary: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <input
                                        type="date"
                                        placeholder="Application Deadline"
                                        value={jobData.applicationDeadline}
                                        onChange={(e) => setJobData({ ...jobData, applicationDeadline: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Skills (comma separated)"
                                    value={jobData.skills}
                                    onChange={(e) => setJobData({ ...jobData, skills: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                    >
                                        {editingJob ? 'Update Job' : 'Create Job'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowJobForm(false);
                                            setEditingJob(null);
                                            resetJobForm();
                                        }}
                                        className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Applications Section */}
                    {showApplicationsSection && (
                        <div className="bg-white rounded-lg shadow p-6 mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">Job Applications</h3>
                                <button
                                    onClick={() => setShowApplicationsSection(false)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                                >
                                    Close
                                </button>
                            </div>

                            {selectedJobApplications.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No applications yet.</p>
                            ) : (
                                <div className="space-y-4">
                                    {selectedJobApplications.map((application) => (
                                        <div key={application._id} className="border rounded-lg p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h4 className="font-semibold">{application.applicant.name}</h4>
                                                    <p className="text-sm text-gray-600">{application.applicant.email}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <select
                                                        value={application.status}
                                                        onChange={(e) => handleUpdateApplicationStatus(application._id, e.target.value)}
                                                        className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    >
                                                        <option value="applied">Applied</option>
                                                        <option value="reviewing">Reviewing</option>
                                                        <option value="interview">Interview</option>
                                                        <option value="rejected">Rejected</option>
                                                        <option value="accepted">Accepted</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-700 mb-2">
                                                <strong>Applied:</strong> {new Date(application.appliedAt).toLocaleDateString()}
                                            </p>
                                            {application.coverLetter && (
                                                <div className="bg-gray-50 p-3 rounded-lg">
                                                    <p className="text-sm font-medium">Cover Letter:</p>
                                                    <p className="text-sm text-gray-700 mt-1">{application.coverLetter}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Jobs Grid */}
                    {loading ? (
                        <div className="text-center py-8">Loading...</div>
                    ) : jobs.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No jobs posted yet. Create your first job posting!
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {jobs.map((job) => (
                                <div key={job._id} className="bg-white rounded-lg shadow p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold mb-1">{job.title}</h3>
                                            <p className="text-gray-600">{job.location}</p>
                                            <p className="text-sm text-gray-500">
                                                {job.jobType} • {job.experienceLevel}
                                            </p>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${job.isActive
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}>
                                            {job.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>

                                    <p className="text-gray-700 mb-4 line-clamp-3">{job.description}</p>

                                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                        <span>Applications: {job.applicationCount || 0}</span>
                                        <span>Posted: {new Date(job.createdAt).toLocaleDateString()}</span>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => fetchJobApplications(job._id)}
                                            className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors text-sm"
                                        >
                                            View Applications ({job.applicationCount || 0})
                                        </button>
                                        <button
                                            onClick={() => openEditModal(job)}
                                            className="flex-1 bg-gray-500 text-white py-2 px-3 rounded-lg hover:bg-gray-600 transition-colors text-sm"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteJob(job._id)}
                                            className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default RecruiterDashboard;