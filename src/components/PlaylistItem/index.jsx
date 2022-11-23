import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import { Avatar, IconButton } from '@mui/material';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

import image from '~/assets/images/anh_test.jpg';
import styles from './styles.scoped.scss';

const cx = classNames.bind(styles);

// const artists = [
//     {
//         id: '1',
//         name: 'Imagine Dragons',
//     },
//     {
//         id: '2',
//         name: 'Alan Walker',
//     },
// ];

const PlaylistItem = ({ type = 'default', playlist, to }) => {
    const [activePlayBtn, setActivePlayBtn] = useState(false);

    return (
        <>
            {type === 'reduce' ? (
                <div
                    className={cx('container-reduce')}
                    onMouseEnter={() => setActivePlayBtn(true)}
                    onMouseLeave={() => setActivePlayBtn(false)}
                >
                    <Link className={cx('playlist-link')} to={to}>
                        <div className={cx('playlist')}>
                            <Avatar
                                className={cx('image')}
                                variant='square'
                                src={image}
                                alt='anh'
                                sx={{ width: '75px', height: '75px' }}
                            />
                            <div className={cx('info')}>
                                Bài hát yêu thích fdsf asdf sdf sdafsd afsdfsdfsdaf sdf asdf sdafa sdf sdfa dsfas fds
                                fsdaf asdfads fas fasfa fdsf sdfasd fasdf sadf as <p className={cx('name')} />
                            </div>
                        </div>
                    </Link>
                    <IconButton className={cx('reduce-play-btn', { active: activePlayBtn })} disableRipple>
                        <PlayCircleIcon
                            sx={{
                                width: '50px',
                                height: '50px',
                            }}
                        />
                    </IconButton>
                </div>
            ) : (
                <div
                    className={cx('container')}
                    onMouseEnter={() => setActivePlayBtn(true)}
                    onMouseLeave={() => setActivePlayBtn(false)}
                >
                    <Link className={cx('playlist-img-link')} to={to}>
                        {/* <Avatar
                            className={cx('image', { active: true })}
                            variant='rounded'
                            src={image}
                            alt='anh'
                            sx={{ width: '200px', height: '200px' }}
                        /> */}
                        <img className={cx('image', { active: activePlayBtn })} src={image} alt='anh' />
                    </Link>
                    <div className={cx('info')}>
                        <Link className={cx('playlist-link')}>
                            <p className={cx('name')}>Today's Top Hits</p>
                        </Link>
                        <div className={cx('detail')}>
                            {/* <div className={cx('artists')}>
                                {artists.map((artist) => (
                                    <>
                                        <Link to={artist.id}>{artist.name}</Link>,{' '}
                                    </>
                                ))}
                            </div> */}
                            <div className={cx('description')}>
                                fdsa fdsa fdsflds Lorem ipsum dolor sit amet consectetur, adipisicing elit. A asperiores
                                facere, obcaecati soluta minima aut voluptates id
                            </div>
                        </div>
                    </div>
                    <IconButton className={cx('play-btn', { active: activePlayBtn })} disableRipple>
                        <PlayCircleIcon
                            sx={{
                                width: '50px',
                                height: '50px',
                            }}
                        />
                    </IconButton>
                </div>
            )}
        </>
    );
};

export default PlaylistItem;
