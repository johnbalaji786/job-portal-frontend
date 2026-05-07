import axios from "axios";

const baseURL = 'http://localhost:3001/api/v1';

const protectedInstance = axios.create({
    baseURL: baseURL,
    timeout: 10000,
    headers: {
        "Content-Length": "application/json"
    },
    withCredentials: true // include cookies in requests
});

export default protectedInstance;