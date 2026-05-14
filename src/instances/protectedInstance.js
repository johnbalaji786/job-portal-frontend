import axios from "axios";

const baseURL = 'https://job-portal-backend-fnog.onrender.com/api/v1';

const protectedInstance = axios.create({
    baseURL: baseURL,
    timeout: 10000,
    headers: {
        "content-type": "application/json"
    },
    withCredentials: true // include cookies in requests
});

export default protectedInstance;