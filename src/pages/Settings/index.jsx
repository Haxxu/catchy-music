import React from 'react';
import classNames from 'classnames/bind';

import DropdownLanguague from '~/components/DropdownLanguage';
import styles from './styles.scoped.scss';

const cx = classNames.bind(styles);

const Settings = () => {
    return (
        <div className={cx('container')}>
            <div className={cx('section')}>
                <div className={cx('heading')}>Language</div>
                <DropdownLanguague />
            </div>
            <div className={cx('languages')} />
        </div>
    );
};

export default Settings;
