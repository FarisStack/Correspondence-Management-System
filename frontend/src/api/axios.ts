import axios from 'axios';

export default () => {

    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
        withCredentials: true, //XMLHttpRequest responses from a different domain cannot set cookie values for their own domain unless withCredentials is set to true before making the request.
        headers: {
            employeeCurrentPositionId: localStorage.getItem('employeeCurrentPositionId') as string
            // 'Content-type': 'application/json',
            // Accept: 'application/json',
        }
    });

    // axiosInstance.interceptors.request.use(
    //     (config) => {
    //         console.log("AxiosConfig: ", config);
    //         return config;
    //     },
    //     (error) => {
    //         return Promise.reject(error);
    //     }
    // );

    return axiosInstance;
}
// read this page: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials
// for info about what `withCredentials` does