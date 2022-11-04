import React, { useEffect, useState } from 'react';
import { Grid, CircularProgress } from '@mui/material';
import classNames from 'classnames/bind';

import axiosInstance from '~/api/axiosInstance';
import { getUsersInfoUrl } from '~/api/urls/usersUrl';
import { getArtistsInfoUrl } from '~/api/urls/artistsUrl';
import { getTracksInfoUrl } from '~/api/urls/tracksUrls';
import { getAlbumsInfoUrl } from '~/api/urls/albumsUrl';
import { getPlaylistsInfoUrl } from '~/api/urls/playlistsUrl';
import styles from './styles.scoped.scss';

const cx = classNames.bind(styles);

const Dashboard = () => {
    const [usersInfo, setUsersInfo] = useState(null);
    const [artistsInfo, setArtistsInfo] = useState(null);
    const [tracksInfo, setTracksInfo] = useState(null);
    const [albumsInfo, setAlbumsInfo] = useState(null);
    const [playlistsInfo, setPlaylistsInfo] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const { data: users } = await axiosInstance(getUsersInfoUrl);
            setUsersInfo(users.data);

            const { data: artists } = await axiosInstance(getArtistsInfoUrl);
            setArtistsInfo(artists.data);

            const { data: tracks } = await axiosInstance(getTracksInfoUrl);
            setTracksInfo(tracks.data);

            const { data: albums } = await axiosInstance(getAlbumsInfoUrl);
            setAlbumsInfo(albums.data);

            const { data: playlists } = await axiosInstance(getPlaylistsInfoUrl);
            setPlaylistsInfo(playlists.data);
        };

        fetchData().catch(console.error);
    }, []);

    return (
        <div className={cx('container')}>
            <div className={cx('header')}>
                <h2>Welcome back!</h2>
            </div>
            <Grid container spacing={1}>
                <Grid item xs={12} md={6} xl={4}>
                    {usersInfo ? (
                        <div className={cx('info')}>
                            <div className={cx('left')}>
                                <div className={cx('title')}>Users</div>
                                <div className={cx('new-today')}>
                                    <span className={cx('number')}>{nFormatter(usersInfo.newUsersToday)}</span>
                                    <span className={cx('percentage')}>
                                        {parseFloat(usersInfo.newUsersToday / usersInfo.totalUsers).toPrecision(2)}%
                                    </span>
                                </div>
                                <div className={cx('bottom-title')}>New Members today</div>
                            </div>
                            <div className={cx('right')}>
                                <div className={cx('detail-info')}>
                                    Total Users:{' '}
                                    <span className={cx('number')}>{nFormatter(usersInfo.totalUsers)}</span>
                                </div>
                                <div className={cx('detail-info')}>
                                    This month:{' '}
                                    <span className={cx('number')}>{nFormatter(usersInfo.newUsersThisMonth)}</span>
                                    <span className={cx('percentage')}>
                                        {parseFloat(usersInfo.newUsersThisMonth / usersInfo.totalUsers).toPrecision(2)}%
                                    </span>
                                </div>
                                <div className={cx('detail-info')}>
                                    Last month:{' '}
                                    <span className={cx('number')}>{nFormatter(usersInfo.newUsersLastMonth)}</span>
                                    <span className={cx('percentage')}>
                                        {parseFloat(usersInfo.newUsersLastMonth / usersInfo.totalUsers).toPrecision(2)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <CircularProgress color='primary' />
                    )}
                </Grid>
                <Grid item xs={12} md={6} xl={4}>
                    {artistsInfo ? (
                        <div className={cx('info')}>
                            <div className={cx('left')}>
                                <div className={cx('title')}>Artist</div>
                                <div className={cx('new-today')}>
                                    <span className={cx('number')}>{nFormatter(artistsInfo.totalArtists)}</span>
                                </div>
                                <div className={cx('bottom-title')}>Total Artists</div>
                            </div>
                        </div>
                    ) : (
                        <CircularProgress color='primary' />
                    )}
                </Grid>
                <Grid item xs={12} md={6} xl={4}>
                    {tracksInfo ? (
                        <div className={cx('info')}>
                            <div className={cx('left')}>
                                <div className={cx('title')}>Tracks</div>
                                <div className={cx('new-today')}>
                                    <span className={cx('number')}>{nFormatter(tracksInfo.newTracksToday)}</span>
                                </div>
                                <div className={cx('bottom-title')}>New Tracks today</div>
                            </div>
                            <div className={cx('right')}>
                                <div className={cx('detail-info')}>
                                    Total Tracks:{' '}
                                    <span className={cx('number')}>{nFormatter(tracksInfo.totalTracks)}</span>
                                </div>
                                <div className={cx('detail-info')}>
                                    This month:{' '}
                                    <span className={cx('number')}>{nFormatter(tracksInfo.newTracksThisMonth)}</span>
                                </div>
                                <div className={cx('detail-info')}>
                                    Last month:{' '}
                                    <span className={cx('number')}>{nFormatter(tracksInfo.newTracksLastMonth)}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <CircularProgress color='primary' />
                    )}
                </Grid>
                <Grid item xs={12} md={6} xl={4}>
                    {albumsInfo ? (
                        <div className={cx('info')}>
                            <div className={cx('left')}>
                                <div className={cx('title')}>Albums</div>
                                <div className={cx('new-today')}>
                                    <span className={cx('number')}>{nFormatter(albumsInfo.newAlbumsToday)}</span>
                                </div>
                                <div className={cx('bottom-title')}>New Albums today</div>
                            </div>
                            <div className={cx('right')}>
                                <div className={cx('detail-info')}>
                                    Total Albums:{' '}
                                    <span className={cx('number')}>{nFormatter(albumsInfo.totalAlbums)}</span>
                                </div>
                                <div className={cx('detail-info')}>
                                    This month:{' '}
                                    <span className={cx('number')}>{nFormatter(albumsInfo.newAlbumsThisMonth)}</span>
                                </div>
                                <div className={cx('detail-info')}>
                                    Last month:{' '}
                                    <span className={cx('number')}>{nFormatter(albumsInfo.newAlbumsLastMonth)}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <CircularProgress color='primary' />
                    )}
                </Grid>
                <Grid item xs={12} md={6} xl={4}>
                    {playlistsInfo ? (
                        <div className={cx('info')}>
                            <div className={cx('left')}>
                                <div className={cx('title')}>Playlists</div>
                                <div className={cx('new-today')}>
                                    <span className={cx('number')}>{nFormatter(playlistsInfo.newPlaylistsToday)}</span>
                                </div>
                                <div className={cx('bottom-title')}>New Playlists today</div>
                            </div>
                            <div className={cx('right')}>
                                <div className={cx('detail-info')}>
                                    Total Playlists:{' '}
                                    <span className={cx('number')}>{nFormatter(playlistsInfo.totalPlaylists)}</span>
                                </div>
                                <div className={cx('detail-info')}>
                                    This month:{' '}
                                    <span className={cx('number')}>
                                        {nFormatter(playlistsInfo.newPlaylistsThisMonth)}
                                    </span>
                                </div>
                                <div className={cx('detail-info')}>
                                    Last month:{' '}
                                    <span className={cx('number')}>
                                        {nFormatter(playlistsInfo.newPlaylistsLastMonth)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <CircularProgress color='primary' />
                    )}
                </Grid>
            </Grid>
        </div>
    );
};

function nFormatter(num) {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num;
}

export default Dashboard;
