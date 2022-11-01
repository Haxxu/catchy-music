import React from 'react';
import classNames from 'classnames/bind';

import Sidebar from '~/components/admin/Sidebar';
import Navbar from '~/components/admin/Navbar';
import styles from './styles.scoped.scss';

const cx = classNames.bind(styles);

const AdminDashboardLayout = ({ children }) => {
    return (
        <div className={cx('container')}>
            <div className={cx('sidebar')}>
                <Sidebar />
            </div>
            <div className={cx('main')}>
                <div className='navbar'>
                    <Navbar />
                </div>
                <div className={cx('main-content')}>{children}</div>
            </div>
        </div>
    );
};

export default AdminDashboardLayout;
