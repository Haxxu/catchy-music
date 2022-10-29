import axios from 'axios';

let _token = null;
const root = JSON.parse(window.localStorage.getItem('persist:root'));

if (root) {
    const { auth } = root;
    const { token } = JSON.parse(auth);

    if (token) {
        _token = token;
    }
}

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json',
        'x-auth-token': _token ? _token : '',
    },
});

axiosInstance.interceptors.request.use(
    (req) => {
        return Promise.resolve(req);
    },
    (error) => {
        if (error.response && error.response.status >= 400 && error.response.status < 500) {
            console.error(error.response.data.message);
        } else {
            console.error(error);
            console.log('Something went wrong!');
        }
        return Promise.reject(error);
    },
);

export default axiosInstance;
