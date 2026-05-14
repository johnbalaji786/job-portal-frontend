import { Navigate, useLoaderData } from "react-router";
import Navbar from "../components/Navbar";
import {useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAllCompanies, getAllRecruiters,deleteCompany , updateCompany,createRecruiter, createCompany} from "../services/adminServices";

const AdminDashboard = () => {
    const userData = useLoaderData();
    const [user] = useState(userData.user);

    const [companies, setCompanies] = useState([]);
    const [recruiters, setRecruiters] = useState([]);
    const [activeTab, setActiveTab] = useState('companies');
    const [loading, setLoading] = useState(false);
    const [showCompanyForm, setShowCompanyForm] = useState(false);
    const [editingCompany, setEditingCompany] = useState(null);
    const [companyData, setCompanyData] = useState({
        name: '',
        description: '',
        website: '',
        industry: '',
        location: '',
        size: '',
        foundedYear: ''
    });
    const [showRecruiterForm, setShowRecruiterForm] = useState(false);
    const [recruiterData, setRecruiterData] = useState({
        name: '',
        email: '',
        password: '',
        companyId: ''
    });

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

    const resetCompanyForm = useCallback(() => {
        setCompanyData({
            name: '',
            description: '',
            website: '',
            industry: '',
            location: '',
            size: '',
            foundedYear: ''
        });
    }, []);

    const resetRecruiterForm = useCallback(() => {
        setRecruiterData({
            name: '',
            email: '',
            password: '',
            companyId: ''
        });
    }, []);

    const handleUpdateCompany = useCallback(async (e) => {
        e.preventDefault();
        try {
            const formattedData = {
                ...companyData,
                foundedYear: companyData.foundedYear ? parseInt(companyData.foundedYear, 10) : undefined
            };
            await updateCompany(editingCompany._id, formattedData);
            toast.success('Company updated successfully!');
            setShowCompanyForm(false);
            setEditingCompany(null);
            resetCompanyForm();
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update company');
        }


    }, [editingCompany, companyData, resetCompanyForm]);

    const handleCreateCompany = useCallback(async (e) => {
        e.preventDefault();

        try {
            const formattedData = {
                ...companyData,
                foundedYear: companyData.foundedYear ? parseInt(companyData.foundedYear, 10) : undefined
            };
            await createCompany(formattedData);
            toast.success('Company created successfully!');
            setShowCompanyForm(false);
            resetCompanyForm();
            fetchData();
        } catch (error) {
            toast.error(error.message?.data?.message || 'Failed to create company. Please try again later.');
        }
    }, [companyData, resetCompanyForm]);

    const handleDeleteCompany = useCallback(async (id) => {
        if (window.confirm('Are you sure you want to delete this company?')) {
            try {
                await deleteCompany(id);
                toast.success('Company deleted successfully!');
                fetchData();
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to delete company');
            }
        }
    }, []);

    const handleCreateRecruiter = useCallback(async (e) => {
        e.preventDefault();
        try {
            await createRecruiter(recruiterData);
            toast.success('Recruiter created successfully!');
            setShowRecruiterForm(false);
            resetRecruiterForm();
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create recruiter');
        }
    }, [recruiterData, resetRecruiterForm]);


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

                {/* Companies Tab */}
                {activeTab === 'companies' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">Companies</h2>
                            <button
                                onClick={() => setShowCompanyForm(!showCompanyForm)}
                                className={`px-4 py-2 rounded transition-colors ${showCompanyForm
                                    ? 'bg-red-600 hover:bg-red-700 text-white'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                                    }`}
                            >
                                {showCompanyForm ? 'Cancel' : 'Add Company'}
                            </button>
                        </div>

                        {/* inline company form */}
                        {
                            showCompanyForm && (
                                <div className="bg-white rounded-lg shadow p-6 mb-6">
                                    <h3 className="text-lg font-semibold mb-4">
                                        {editingCompany ? 'Edit Company' : 'Create New Company'}
                                    </h3>

                                    <form
                                        onSubmit={editingCompany ? handleUpdateCompany : handleCreateCompany}
                                        className="space-y-4"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                placeholder="Company Name"
                                                value={companyData.name}
                                                onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                            <input
                                                type="text"
                                                placeholder="Industry"
                                                value={companyData.industry}
                                                onChange={(e) => setCompanyData({ ...companyData, industry: e.target.value })}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                        </div>
                                        <textarea
                                            placeholder="Description"
                                            value={companyData.description}
                                            onChange={(e) => setCompanyData({ ...companyData, description: e.target.value })}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
                                            required
                                        />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input
                                                type="url"
                                                placeholder="Website (optional)"
                                                value={companyData.website}
                                                onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Location"
                                                value={companyData.location}
                                                onChange={(e) => setCompanyData({ ...companyData, location: e.target.value })}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <select
                                                value={companyData.size}
                                                onChange={(e) => setCompanyData({ ...companyData, size: e.target.value })}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            >
                                                <option value="">Select Company Size</option>
                                                <option value="1-10">1-10 employees</option>
                                                <option value="11-50">11-50 employees</option>
                                                <option value="51-200">51-200 employees</option>
                                                <option value="201-500">201-500 employees</option>
                                                <option value="501-1000">501-1000 employees</option>
                                                <option value="1000+">1000+ employees</option>
                                            </select>
                                            <input
                                                type="number"
                                                placeholder="Founded Year"
                                                value={companyData.foundedYear}
                                                onChange={(e) => setCompanyData({ ...companyData, foundedYear: e.target.value })}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                min="1800"
                                                max={new Date().getFullYear()}
                                            />
                                        </div>
                                        <div className="flex gap-3 pt-4">
                                            <button
                                                type="submit"
                                                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                            >
                                                {editingCompany ? 'Update Company' : 'Create Company'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowCompanyForm(false);
                                                    setEditingCompany(null);
                                                    resetCompanyForm();
                                                }}
                                                className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        {loading ? (
                            <div className="text-center py-8">Loading...</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {companies.map((company) => (
                                    <div key={company._id} className="bg-white rounded-lg shadow p-6">
                                        <h3 className="text-lg font-semibold mb-2">{company.name}</h3>
                                        <p className="text-gray-600 mb-2">{company.industry}</p>
                                        <p className="text-sm text-gray-500 mb-2">{company.location}</p>
                                        <p className="text-sm text-gray-500 mb-4">{company.size} employees</p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setEditingCompany(company);
                                                    setCompanyData({
                                                        name: company.name,
                                                        description: company.description,
                                                        website: company.website,
                                                        industry: company.industry,
                                                        location: company.location,
                                                        size: company.size,
                                                        foundedYear: company.foundedYear
                                                    });
                                                    setShowCompanyForm(true);
                                                }}
                                                className="flex-1 bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCompany(company._id)}
                                                className="flex-1 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Recruiters Tab */}
                {activeTab === 'recruiters' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">Recruiters</h2>
                            <button
                                onClick={() => setShowRecruiterForm(!showRecruiterForm)}
                                className={`px-4 py-2 rounded transition-colors ${showRecruiterForm
                                    ? 'bg-red-600 hover:bg-red-700 text-white'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                                    }`}
                            >
                                {showRecruiterForm ? 'Cancel' : 'Add Recruiter'}
                            </button>
                        </div>

                        {/* Inline Recruiter Form */}
                        {showRecruiterForm && (
                            <div className="bg-white rounded-lg shadow p-6 mb-6">
                                <h3 className="text-lg font-semibold mb-4">Create New Recruiter</h3>
                                <form onSubmit={handleCreateRecruiter} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Full Name"
                                            value={recruiterData.name}
                                            onChange={(e) => setRecruiterData({ ...recruiterData, name: e.target.value })}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            value={recruiterData.email}
                                            onChange={(e) => setRecruiterData({ ...recruiterData, email: e.target.value })}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            value={recruiterData.password}
                                            onChange={(e) => setRecruiterData({ ...recruiterData, password: e.target.value })}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                            minLength="6"
                                        />
                                        <select
                                            value={recruiterData.companyId}
                                            onChange={(e) => setRecruiterData({ ...recruiterData, companyId: e.target.value })}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        >
                                            <option value="">Select Company</option>
                                            {companies.map((company) => (
                                                <option key={company._id} value={company._id}>
                                                    {company.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="submit"
                                            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                        >
                                            Create Recruiter
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowRecruiterForm(false);
                                                resetRecruiterForm();
                                            }}
                                            className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Company
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Created At
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {recruiters.map((recruiter) => (
                                        <tr key={recruiter._id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {recruiter.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {recruiter.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {recruiter.assignedCompany?.name || 'No Company'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(recruiter.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div >
    )
}

export default AdminDashboard;