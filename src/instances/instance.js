import axios from "axios";

const baseURL = "https://job-portal-backend-fnog.onrender.com/api/v1";

const instance = axios.create({
    baseURL,
    timeout: 10000,
    withCredentials: true 
});

export default instance;