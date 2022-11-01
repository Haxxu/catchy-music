import React, { useState } from 'react';
import classNames from 'classnames/bind';
import { Avatar, ClickAwayListener } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import DarkModeToggle from '~/components/DarkMode/DarkModeToggle';
import styles from './styles.scoped.scss';

const cx = classNames.bind(styles);

const Navbar = () => {
    return (
        <div className={cx('container')}>
            <div className={cx('navigation')}>
                <div className={cx('before')}>
                    <NavigateBeforeIcon />
                </div>
                <div className={cx('next')}>
                    <NavigateNextIcon />
                </div>
            </div>
            <div className='search' />
            <div className={cx('settings')}>
                <DarkModeToggle />
                <Avatar sizes='large' />
            </div>
        </div>
    );
};

export default Navbar;
