import axios from "axios";
import { BASE_URL_FOR_AXIOS } from "../constants/constants";

const webAppURI = BASE_URL_FOR_AXIOS;

if (!webAppURI) throw new Error("Provide web app uri.");

export const axiosAPI = axios.create({
    baseURL: `${webAppURI}/api/`,
    // baseURL: "https://vsn5nrl9-3000.euw.devtunnels.ms/api/",
});
