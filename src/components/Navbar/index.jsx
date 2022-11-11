import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import classNames from 'classnames/bind';
import { Avatar } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import LogoutIcon from '@mui/icons-material/Logout';

import useAuth from '~/hooks/useAuth';
import { menuOptions } from './config';
import { logout } from '~/redux/authSlice';
import DarkModeToggle from '~/components/DarkMode/DarkModeToggle';
import styles from './styles.scoped.scss';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

const Navbar = () => {
    const [profileMenu, setProfileMenu] = useState(false);

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
                            sizes='large'
                            sx={{
                                boxShadow:
                                    'rgba(50, 50, 105, 0.15) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px',
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
