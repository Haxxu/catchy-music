import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconButton } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import classNames from 'classnames/bind';

import styles from './styles.scoped.scss';
import axiosInstance from '~/api/axiosInstance';
import {
    checkLikedTrackUrl,
    checkSavedAlbumUrl,
    checkSavedPlaylistUrl,
    saveTrackToLibraryUrl,
    removeLikedTrackFromLibraryUrl,
    saveAlbumToLibraryUrl,
    removeAlbumFromLibraryUrl,
    savePlaylistToLibraryUrl,
    removePlaylistFromLibraryUrl,
} from '~/api/urls/me';
import { updateLikeTrackState } from '~/redux/updateStateSlice';

const cx = classNames.bind(styles);

const Like = ({ type = 'track', size = 'normal', trackId, albumId, playlistId, setUpdate }) => {
    const [liked, setLiked] = useState(false);

    const { likeTrackState } = useSelector((state) => state.updateState);

    const dispatch = useDispatch();

    const handleLike = async () => {
        try {
            if (liked) {
                if (type === 'track') {
                    const { data } = await axiosInstance.delete(removeLikedTrackFromLibraryUrl, {
                        data: { track: trackId, album: albumId },
                    });
                    setLiked(data.data);
                    dispatch(updateLikeTrackState());
                } else if (type === 'album') {
                    const { data } = await axiosInstance.delete(removeAlbumFromLibraryUrl, {
                        data: { album: albumId },
                    });
                    setLiked(data.data);
                } else {
                    const { data } = await axiosInstance.delete(removePlaylistFromLibraryUrl, {
                        data: { playlist: playlistId },
                    });
                    setLiked(data.data);
                }
            } else {
                if (type === 'track') {
                    const { data } = await axiosInstance.put(saveTrackToLibraryUrl, { track: trackId, album: albumId });
                    setLiked(data.data);
                    dispatch(updateLikeTrackState());
                } else if (type === 'album') {
                    const { data } = await axiosInstance.put(saveAlbumToLibraryUrl, { album: albumId });
                    setLiked(data.data);
                } else {
                    const { data } = await axiosInstance.put(savePlaylistToLibraryUrl, { playlist: playlistId });
                    setLiked(data.data);
                }
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (type === 'track') {
                const { data } = await axiosInstance.get(checkLikedTrackUrl, { params: { trackId, albumId } });
                setLiked(data.data);
            } else if (type === 'album') {
                const { data } = await axiosInstance.get(checkSavedAlbumUrl, { params: { albumId } });
                setLiked(data.data);
            } else {
                const { data } = await axiosInstance.get(checkSavedPlaylistUrl, { params: { playlistId } });
                setLiked(data.data);
            }
        };

        fetchData().catch(console.error);
        // eslint-disable-next-line
    }, [liked, trackId, albumId, playlistId, likeTrackState]);

    return (
        <IconButton className={cx('like-btn')} onClick={handleLike} disableRipple>
            {liked ? (
                <FavoriteIcon className={cx('like-filled', { large: size === 'large' })} />
            ) : (
                <FavoriteBorderIcon className={cx('like-outlined', { large: size === 'large' })} />
            )}
        </IconButton>
    );
};

export default Like;
