import protectedInstance from "../instances/protectedInstance";
import instance from "../instances/instance";

export const getAllJobs = async (params = {}) => {
    const searchParams = new URLSearchParams(params).toString();
    const response = await instance.get(`/jobs?${searchParams}`);
    return response.data;
};

export const getJobById = async (id) => {
    const response = await instance.get(`/jobs/${id}`);
    return response.data;
};

export const createJob = async (jobData) => {
    const response = await protectedInstance.post('/jobs', jobData);
    return response.data;
};

export const updateJob = async (id, jobData) => {
    const response = await protectedInstance.put(`/jobs/${id}`, jobData);
    return response.data;
};

export const deleteJob = async (id) => {
    const response = await protectedInstance.delete(`/jobs/${id}`);
    return response.data;
};

export const getMyJobs = async () => {
    const response = await protectedInstance.get('/jobs/recruiter/jobs');
    return response.data;
};

export const applyForJob = async (jobId, applicationData) => {
    const response = await protectedInstance.post(`/applications/${jobId}/apply`, applicationData);
    return response.data;
};

export const getJobApplications = async (jobId) => {
    const response = await protectedInstance.get(`/jobs/recruiter/jobs/${jobId}/applications`);
    return response.data;
};

export const updateApplicationStatus = async (applicationId, status) => {
    const response = await protectedInstance.put(`/applications/${applicationId}/status`, { status });
    return response.data;
};

export const getMyApplications = async () => {
    const response = await protectedInstance.get('/applications');
    return response.data;
};