import React from 'react';
import classNames from 'classnames/bind';

import Navbar from '~/components/Navbar';
import Sidebar from '~/components/Sidebar';
import Footer from '~/components/Footer';
import styles from './styles.scoped.scss';

const cx = classNames.bind(styles);

const MainLayout = ({ children }) => {
    return (
        <div className={cx('container')}>
            <div className={cx('sidebar')}>
                <Sidebar />
            </div>
            <div className={cx('main')}>
                <div className={cx('navbar')}>
                    <Navbar />
                </div>
                <div className={cx('main-content')}>{children}</div>
            </div>
            <div className={cx('footer')}>
                <Footer />
            </div>
        </div>
    );
};

export default MainLayout;