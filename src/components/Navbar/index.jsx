import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import classNames from 'classnames/bind';
import { Avatar } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import LogoutIcon from '@mui/icons-material/Logout';
import { toast } from 'react-toastify';

import DarkModeToggle from '~/components/DarkMode/DarkModeToggle';
import { menuOptions } from './config';
import useAuth from '~/hooks/useAuth';
import { logout } from '~/redux/authSlice';
import axiosInstance from '~/api/axiosInstance';
import styles from './styles.scoped.scss';
import { getCurrentUserProfileUrl } from '~/api/urls/me';

const cx = classNames.bind(styles);

const Navbar = () => {
    const [profileMenu, setProfileMenu] = useState(false);
    const [profileImage, setProfileImage] = useState('');

    const { name, email, type } = useAuth();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const toggleProfileMenu = () => {
        setProfileMenu((prev) => !prev);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
        toast.success('Logout successfully');
    };

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await axiosInstance.get(getCurrentUserProfileUrl);
            setProfileImage(data?.data?.image);
        };

        fetchData().catch(console.error);
    }, []);

    return (
        <div className={cx('container')}>
            <div className={cx('navigation')}>
                <div className={cx('icon', 'before')} onClick={() => navigate(-1)}>
                    <ArrowBackIosNewIcon />
                </div>
                <div className={cx('icon', 'next')} onClick={() => navigate(2)}>
                    <ArrowForwardIosIcon />
                </div>
            </div>
            <div className={cx('settings')}>
                <DarkModeToggle />
                <div className={cx('profile')}>
                    <div className={cx('avatar')} onClick={toggleProfileMenu}>
                        <Avatar
                            src={profileImage}
                            sizes='large'
                            sx={{
                                boxShadow: 3,
                            }}
                        />
                    </div>
                    {profileMenu && (
                        <div className={cx('profile-menu')}>
                            <div className={cx('info')}>
                                <p className={cx('name')}>{name}</p>
                                <p className={cx('email')}>{email}</p>
                            </div>
                            <div className={cx('options')}>
                                {menuOptions.map((option, index) => {
                                    if (option.roles.includes(type)) {
                                        return (
                                            <Link
                                                to={option.path}
                                                className={cx('option')}
                                                key={index}
                                                onClick={() => toggleProfileMenu()}
                                            >
                                                <span className={cx('icon')}>{option.icon}</span>{' '}
                                                <span>{option.title}</span>
                                            </Link>
                                        );
                                    }
                                    return null;
                                })}
                            </div>
                            <div className={cx('logout')}>
                                <div className={cx('option')} onClick={handleLogout}>
                                    <span className={cx('icon')}>
                                        <LogoutIcon fontSize='large' />
                                    </span>{' '}
                                    Logout
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
