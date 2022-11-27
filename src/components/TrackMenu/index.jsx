import React, { useState } from 'react';
import classNames from 'classnames/bind';
import { useDispatch } from 'react-redux';
import { ClickAwayListener, Divider, IconButton, Paper, Popper } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import GoToArtistMenu from '~/components/GoToArtistMenu';
import styles from './styles.module.scss';
import axiosInstance from '~/api/axiosInstance';
import { addItemToQueueUrl } from '~/api/urls/me';
import AddToPlaylistMenu from '~/components/AddToPlaylistMenu';
import { removeLikedTrackFromLibraryUrl } from '~/api/urls/me';
import { updateLikeTrackState } from '~/redux/updateStateSlice';

const cx = classNames.bind(styles);

const TrackMenu = ({ trackId, albumId, artists, context_uri, position }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const handleClick = (e) => {
        setAnchorEl(anchorEl ? null : e.currentTarget);
    };

    const handleClickAway = () => {
        setAnchorEl(null);
    };

    const addTrackToQueue = async () => {
        const { data } = await axiosInstance.post(addItemToQueueUrl, { items: [{ context_uri, position }] });
        toast.success(data.message);
        setAnchorEl(null);
    };

    const goToTrackPage = () => {
        navigate(`/track/${trackId}`);
    };

    const goToAlbumPage = () => {
        navigate(`/album/${albumId}`);
    };

    const removeTrackByContext = async (type, trackId, albumId) => {
        try {
            console.log('alo');
            if (type === 'likedTrack') {
                console.log('alo');
                const { data } = await axiosInstance.delete(removeLikedTrackFromLibraryUrl, {
                    data: { track: trackId, album: albumId },
                });
                dispatch(updateLikeTrackState());
                toast.success(data.message);
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className={cx('container')} onDoubleClick={(e) => e.stopPropagation()}>
            <IconButton onClick={handleClick} disableRipple sx={{ padding: 0 }}>
                <MoreHorizIcon sx={{ color: 'var(--text-primary)', width: '20px', height: '20px', padding: 0 }} />
            </IconButton>
            <Popper placement='left-start' open={Boolean(anchorEl)} anchorEl={anchorEl} sx={{ zIndex: 9999 }}>
                <ClickAwayListener onClickAway={handleClickAway}>
                    <Paper className={cx('menu-container')}>
                        <div className={cx('menu-list')}>
                            <div className={cx('menu-item')} onClick={addTrackToQueue}>
                                Add to queue
                            </div>
                            <div className={cx('menu-item', 'item-have-sub-menu')}>
                                <AddToPlaylistMenu trackId={trackId} albumId={albumId} />
                            </div>
                            <Divider />
                            <div className={cx('menu-item')} onClick={goToTrackPage}>
                                Go to track
                            </div>
                            <div className={cx('menu-item', 'item-have-sub-menu')}>
                                <GoToArtistMenu artists={artists} />
                            </div>
                            <div className={cx('menu-item')} onClick={goToAlbumPage}>
                                Go to album
                            </div>
                            <Divider />
                            <div
                                className={cx('menu-item')}
                                onClick={() => removeTrackByContext('likedTrack', trackId, albumId)}
                            >
                                Remove from your liked tracks
                            </div>
                        </div>
                    </Paper>
                </ClickAwayListener>
            </Popper>
        </div>
    );
};

export default TrackMenu;
