import axios from "axios";

export const axiosAPI = axios.create({
    // baseURL: "https://vsn5nrl9-3000.euw.devtunnels.ms/api/",
    baseURL: "http://localhost:3000/api/",
});
