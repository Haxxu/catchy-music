import axios from 'axios';
import { toast } from 'react-toastify';

import { loginStart, loginSuccess, loginFailure } from '~/redux/authSlice';
import { loginUrl } from '~/api/urls';

export const login = async (payload, dispatch) => {
    dispatch(loginStart());
    try {
        const { data } = await axios.post(loginUrl, payload);
        dispatch(loginSuccess({ token: data.data }));
        return true;
    } catch (error) {
        dispatch(loginFailure());
        if (error.response && error.response.status >= 400 && error.response.status < 500) {
            toast.error(error.response.data.message);
        } else {
            console.error(error);
            toast.error('Something went wrong!');
        }
        return false;
    }
};
