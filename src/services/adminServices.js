import protectedInstance from "../instances/protectedInstance"

export const getAllCompanies = async () => {
    const response = await protectedInstance.get('/companies');
    return response.data;
}

export const createCompany = async (companyData) => {
    const response = await protectedInstance.post('/companies', companyData);
    return response.data;
};

export const updateCompany = async (id, companyData) => {
    const response = await protectedInstance.put(`/companies/${id}`, companyData);
    return response.data;
};

export const deleteCompany = async (id) => {
    const response = await protectedInstance.delete(`/companies/${id}`);
    return response.data;
};

export const createRecruiter = async (recruiterData) => {
    const response = await protectedInstance.post('/companies/recruiters', recruiterData);
    return response.data;
};

export const getAllRecruiters = async () => {
    try {
        const response = await protectedInstance.get('/companies/recruiters');
        return response.data;
    } catch (error) {
        // If endpoint doesn't exist, return empty array
        return { recruiters: [] };
    }
};