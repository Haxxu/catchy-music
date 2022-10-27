import React from 'react';
import classNames from 'classnames/bind';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import { login } from '~/api/auth';
import styles from './styles.scoped.scss';

const cx = classNames.bind(styles);

const data = {
    email: 'user1@gmail.com',
    password: 'User1@12345!',
};

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = () => {
        login(data, dispatch).then((isSuccess) => {
            if (isSuccess) {
                toast.success('Login successfully');
                navigate('/');
            }
        });
    };

    return (
        <div className={cx('containter')}>
            Login<span className={cx('bg-purple')}>Alo</span>
            <p />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}

export default Login;
