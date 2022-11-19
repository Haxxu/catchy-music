import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import classNames from 'classnames/bind';

import styles from './styles.scoped.scss';

const cx = classNames.bind(styles);

const Like = ({ type = 'track', songId, albumId }) => {
    const [liked, setLiked] = useState(false);

    const handleLike = () => {
        setLiked((prev) => !prev);
    };

    return (
        <IconButton className={cx('like-btn')} onClick={handleLike}>
            {liked ? (
                <FavoriteBorderIcon className={cx('like-outlined')} />
            ) : (
                <FavoriteIcon className={cx('like-filled')} />
            )}
        </IconButton>
    );
};

export default Like;
