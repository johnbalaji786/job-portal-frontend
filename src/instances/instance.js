import axios from "axios";

const baseURL = 'http://localhost:3001/api/v1';

const instance = axios.create({
    baseURL: baseURL,
    timeout: 10000,
    headers: {
        "Content-Length": "application/json"
    }
});

export default instance;