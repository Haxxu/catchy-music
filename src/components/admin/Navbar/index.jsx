import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import { Avatar } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import LogoutIcon from '@mui/icons-material/Logout';

import DarkModeToggle from '~/components/DarkMode/DarkModeToggle';
import useAuth from '~/hooks/useAuth';
import { menuOptions } from './config';
import styles from './styles.scoped.scss';

const cx = classNames.bind(styles);

const Navbar = () => {
    const { name, email } = useAuth();
    const [profileMenu, setProfileMenu] = useState(false);
    const navigate = useNavigate();

    const toggleProfileMenu = () => {
        setProfileMenu((prev) => !prev);
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
                        <Avatar sizes='large' />
                    </div>
                    {profileMenu && (
                        <div className={cx('profile-menu')}>
                            <div className={cx('info')}>
                                <p className={cx('name')}>{name}</p>
                                <p className={cx('email')}>{email}</p>
                            </div>
                            <div className={cx('options')}>
                                {menuOptions.map((option, index) => (
                                    <div className={cx('option')}>
                                        <span className={cx('icon')}>{option.icon}</span>{' '}
                                        <Link to={option.path}>{option.title}</Link>
                                    </div>
                                ))}
                            </div>
                            <div className={cx('logout')}>
                                <div className={cx('option')}>
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
