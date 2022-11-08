import React from 'react';
import classNames from 'classnames/bind';

import styles from './styles.scoped.scss';

const cx = classNames.bind(styles);

const Dashboard = () => {
    return <div className={cx('container')}>Dashboard Artist</div>;
};

export default Dashboard;
