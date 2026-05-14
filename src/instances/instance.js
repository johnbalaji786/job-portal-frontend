import axios from "axios";

const baseURL = 'https://job-portal-backend-fnog.onrender.com/api/v1';

const instance = axios.create({
    baseURL: baseURL,
    timeout: 10000,
    headers: {
        "Content-Length": "application/json"
    }
});

export default instance;