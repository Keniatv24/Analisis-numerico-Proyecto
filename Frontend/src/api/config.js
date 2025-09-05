//file of config for the api and axios
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/", // Cambia esto a la URL de tu API
    headers: {
        "Content-Type": "application/json",
    },
    });

export default api;
// This file is used to configure the Axios instance for making API requests.