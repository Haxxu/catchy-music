import axios from 'axios';
import { toast } from 'react-toastify';

import { createUserUrl } from '~/api/urls';

export const createUser = async (payload) => {
    try {
        const { data } = await axios.post(createUserUrl, payload);
        return true;
    } catch (error) {
        if (error.response && error.response.status >= 400 && error.response.status < 500) {
            toast.error(error.response.data.message);
        } else {
            console.error(error);
            toast.error('Something went wrong!');
        }
        return false;
    }
};
