import React from 'react';
import classNames from 'classnames/bind';
import GitHubIcon from '@mui/icons-material/GitHub';
import { Divider, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';

import styles from './styles.scoped.scss';

const cx = classNames.bind(styles);

const Footer = () => {
    return (
        <div className={cx('container')}>
            <Divider />
            <div className={cx('top')}>
                <div className={cx('about')}>
                    <div className={cx('heading')}>About Catchy Music</div>
                    <div className={cx('text')}>
                        Catchy Music is a music website that can give user interested experience
                    </div>
                </div>
                <div className={cx('info')}>
                    <div className={cx('techniques')}>
                        <div className={cx('heading')}>Techniques</div>
                        <ul className={cx('links')}>
                            <li>
                                <a href='https://www.javascript.com/' className={cx('link')}>
                                    Javascript
                                </a>
                            </li>
                            <li>
                                <a href='https://reactjs.org/' className={cx('link')}>
                                    ReactJS
                                </a>
                            </li>
                            <li>
                                <a href='https://mui.com/' className={cx('link')}>
                                    Material UI
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className={cx('other')}>
                        <div className={cx('heading')}>Other</div>
                        <ul className={cx('links')}>
                            <li>
                                <a href='https://www.javascript.com/' className={cx('link')}>
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a href='https://reactjs.org/' className={cx('link')}>
                                    Contact Us
                                </a>
                            </li>
                            <li>
                                <a href='https://mui.com/' className={cx('link')}>
                                    Privacy Policy
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <Divider />
            <div className={cx('bottom')}>
                <div className={cx('info')}>
                    <div className={cx('copyright')}>
                        &copy;Copyright by <span className={cx('highlight')}>Catchy Music</span>
                    </div>
                    <div className={cx('powered')}>
                        Powered By <span className={cx('highlight')}>Nguyen Ngoc Minh</span>
                    </div>
                </div>
                <div className={cx('link')}>
                    <a className={cx('link')} href='https://github.com/Haxxu'>
                        <IconButton color='primary'>
                            <GitHubIcon sx={{ width: '30px', height: '30px' }} />
                        </IconButton>
                    </a>
                    <a className={cx('link')} href='https://www.facebook.com/profile.php?id=100014062937836'>
                        <IconButton color='primary'>
                            <FacebookIcon sx={{ width: '30px', height: '30px' }} />
                        </IconButton>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Footer;
