import axios from "axios";

const webAppURI = "https://vsn5nrl9-3000.euw.devtunnels.ms";

if (!webAppURI) throw new Error("Provide web app uri.");

export const axiosAPI = axios.create({
    baseURL: `${webAppURI}/api/`,
    // baseURL: "http://localhost:3000/api/",
});
