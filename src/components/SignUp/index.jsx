import React from 'react';
import classNames from 'classnames/bind';

import styles from './styles.scoped.scss';

const cx = classNames.bind(styles);

function SignUp() {
    return <div className={cx('containter')}>SignUp</div>;
}

export default SignUp;
