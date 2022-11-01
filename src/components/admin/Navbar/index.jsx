import React from 'react';
import classNames from 'classnames/bind';
import { Avatar } from '@mui/material';

import DarkModeToggle from '~/components/DarkMode/DarkModeToggle';
import styles from './styles.scoped.scss';

const cx = classNames.bind(styles);

const Navbar = () => {
    return (
        <div className={cx('container')}>
            <div className={cx('navigation')}>prev | next</div>
            <div className='search' />
            <div className={cx('settings')}>
                <DarkModeToggle />
                <Avatar sizes='large' />
            </div>
        </div>
    );
};

export default Navbar;
