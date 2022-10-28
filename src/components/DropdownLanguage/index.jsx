import React, { useState } from 'react';
import classNames from 'classnames/bind';
import cookies from 'js-cookie';

import styles from './styles.scoped.scss';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

const cx = classNames.bind(styles);

const languages = [
    {
        code: 'vi',
        name: 'Tiếng Việt',
        country_code: 'vi',
    },
    {
        code: 'en',
        name: 'English',
        country_code: 'en',
    },
];

const DropdownLanguague = () => {
    const { t, i18n } = useTranslation();

    return (
        <div className={cx('container')}>
            {languages.map(({ code, name }) => (
                <Button size='large' onClick={() => i18n.changeLanguage(code)}>
                    {name}
                </Button>
            ))}
        </div>
    );
};

export default DropdownLanguague;
