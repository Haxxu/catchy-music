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
import { updateLikeTrackState, updatePlaylistState } from '~/redux/updateStateSlice';
import { removeTrackFromPlaylistUrl } from '~/api/urls/playlistsUrl';
import { useAuth } from '~/hooks';

const cx = classNames.bind(styles);

const TrackMenu = ({
    trackId,
    albumId,
    playlistId,
    artists,
    context_uri,
    position,
    inPage = 'playlist',
    playlistOwnerId,
}) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userId } = useAuth();

    const handleClick = (e) => {
        setAnchorEl(anchorEl ? null : e.currentTarget);
    };

    const handleClickAway = () => {
        setAnchorEl(null);
    };

    const addTrackToQueue = async () => {
        try {
            const { data } = await axiosInstance.post(addItemToQueueUrl, { items: [{ context_uri, position }] });
            toast.success(data.message);
            setAnchorEl(null);
        } catch (err) {
            console.log(err);
        }
    };

    const goToTrackPage = () => {
        navigate(`/track/${trackId}`);
    };

    const goToAlbumPage = () => {
        navigate(`/album/${albumId}`);
    };

    const removeTrackFromLikedTracks = async (trackId, albumId) => {
        try {
            const { data } = await axiosInstance.delete(removeLikedTrackFromLibraryUrl, {
                data: { track: trackId, album: albumId },
            });
            dispatch(updateLikeTrackState());
            toast.success(data.message);
        } catch (err) {
            console.log(err);
        }
    };

    const removeTrackFromPlaylist = async (trackId, albumId) => {
        try {
            const { data } = await axiosInstance.delete(removeTrackFromPlaylistUrl(playlistId), {
                data: { track: trackId, album: albumId },
            });
            dispatch(updatePlaylistState());
            setAnchorEl(null);
            toast.success(data.message);
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
                            {inPage === 'liked-tracks' && (
                                <div
                                    className={cx('menu-item')}
                                    onClick={() => removeTrackFromLikedTracks(trackId, albumId)}
                                >
                                    Remove from your liked tracks
                                </div>
                            )}
                            {inPage === 'playlist' && playlistOwnerId === userId && (
                                <div
                                    className={cx('menu-item')}
                                    onClick={() => removeTrackFromPlaylist(trackId, albumId)}
                                >
                                    Remove track from this playlist
                                </div>
                            )}
                        </div>
                    </Paper>
                </ClickAwayListener>
            </Popper>
        </div>
    );
};

export default TrackMenu;
