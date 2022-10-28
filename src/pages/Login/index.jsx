import React, { useState } from 'react';
import classNames from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Joi from 'joi';
import { useTranslation } from 'react-i18next';

import { login } from '~/api/auth';
import { selectAuthFetchingStatus } from '~/redux/authSlice';
import TextField from '~/components/Inputs/TextField';
import styles from './styles.scoped.scss';

const cx = classNames.bind(styles);

function Login() {
    const [data, setData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});

    const { isFetching } = useSelector(selectAuthFetchingStatus);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        login(data, dispatch).then((isSuccess) => {
            if (isSuccess) {
                toast.success('Login successfully');
                navigate('/');
            }
        });
    };

    const handleInputState = (name, value) => {
        setData({ ...data, [name]: value });
    };

    const handleErrorState = (name, value) => {
        value === '' ? delete errors[name] : setErrors({ ...errors, [name]: value });
    };

    const schema = {
        email: Joi.string()
            .email({ tlds: false })
            .required()
            .label('Email'),
        password: Joi.string()
            .required()
            .label('Password'),
    };

    return (
        <div className={cx('containter')}>
            <div>{t('Welcome to React')}</div>
            <form className={cx('form-container')} onSubmit={handleLogin}>
                <TextField
                    label={'Email'}
                    placeholder={'Enter your email'}
                    name='email'
                    value={data.email}
                    schema={schema.email}
                    error={errors.email}
                    handleInputState={handleInputState}
                    handleErrorState={handleErrorState}
                    required
                />
                <TextField
                    label='Password'
                    placeholder='Enter your password'
                    name='password'
                    type='password'
                    value={data.password}
                    schema={schema.password}
                    error={errors.password}
                    handleInputState={handleInputState}
                    handleErrorState={handleErrorState}
                    required
                />
                <button>{t('Login')}</button>
            </form>
        </div>
    );
}

export default Login;
