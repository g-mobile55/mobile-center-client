import axios from "axios";

const webAppURI = process.env.WEB_APP_URI!;

export const axiosAPI = axios.create({
    baseURL: `${webAppURI}/api/`,
    // baseURL: "http://localhost:3000/api/",
});
