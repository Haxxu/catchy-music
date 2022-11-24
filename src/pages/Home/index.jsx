import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';

import styles from './styles.scoped.scss';
import { Grid } from '@mui/material';

import PlaylistItem from '~/components/PlaylistItem';
import AlbumItem from '~/components/AlbumItem';
import axiosInstance from '~/api/axiosInstance';
import { getPlaylistsByTagsUrl } from '~/api/urls/playlistsUrl';
import { getSavedPlaylistsUrl } from '~/api/urls/me';
import { getAlbumsByTagsUrl } from '~/api/urls/albumsUrl';
const cx = classNames.bind(styles);

const Home = () => {
    const [popularPlaylists, setPopularPlaylists] = useState([]);
    const [recommendPlaylists, setRecommendPlaylists] = useState([]);
    const [randomPlaylists, setRandomPlaylists] = useState([]);
    const [savedPlaylists, setSavedPlaylists] = useState([]);
    const [popularAlbums, setPopularAlbums] = useState([]);
    const [newReleaseAlbums, setNewReleaseAlbums] = useState([]);
    const [randomAlbums, setRandomAlbums] = useState([]);

    const hiToUser = () => {
        var today = new Date();
        var curHr = today.getHours();

        if (curHr < 12) {
            return 'Good Morning';
        } else if (curHr < 18) {
            return 'Good Afternoon';
        } else {
            return 'Good Evening';
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const { data: playlistsResponse } = await axiosInstance.get(getPlaylistsByTagsUrl, {
                params: {
                    tags: ['popular', 'recommend', 'random'],
                },
            });
            setPopularPlaylists(playlistsResponse.data.popularPlaylists);
            setRecommendPlaylists(playlistsResponse.data.recommendPlaylists);
            setRandomPlaylists(playlistsResponse.data.randomPlaylists);

            const { data: albumsResponse } = await axiosInstance.get(getAlbumsByTagsUrl, {
                params: {
                    tags: ['popular', 'new-release', 'random'],
                },
            });
            setPopularAlbums(albumsResponse.data.popularAlbums);
            setNewReleaseAlbums(albumsResponse.data.newReleaseAlbums);
            setRandomAlbums(albumsResponse.data.randomAlbums);

            const { data: savedPlaylistsRes } = await axiosInstance(getSavedPlaylistsUrl);
            setSavedPlaylists(savedPlaylistsRes.data);
        };

        fetchData().catch(console.error);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={cx('container')}>
            <section className={cx('section-container')}>
                <h1 className={cx('heading')}>{hiToUser()}</h1>
                <div className={cx('section-content')}>
                    <Grid container spacing={2}>
                        {popularPlaylists?.length !== 0 &&
                            popularPlaylists?.map((item, index) => (
                                <Grid item xl={4} md={6} xs={12} key={index}>
                                    <PlaylistItem type='reduce' playlist={item} to={`/playlist/${item._id}`} />
                                </Grid>
                            ))}
                    </Grid>
                </div>
            </section>

            <section className={cx('section-container')}>
                <h1 className={cx('heading')}>New Release Albums</h1>
                <div className={cx('section-content')}>
                    <Grid container spacing={2}>
                        {newReleaseAlbums?.length !== 0 &&
                            newReleaseAlbums?.map((item, index) => (
                                <Grid item xl={2} lg={3} md={4} xs={6} key={index}>
                                    <AlbumItem album={item} to={`/album/${item._id}`} />
                                </Grid>
                            ))}
                    </Grid>
                </div>
            </section>

            <section className={cx('section-container')}>
                <h1 className={cx('heading')}>Popular Playlists</h1>
                <div className={cx('section-content')}>
                    <Grid container spacing={2}>
                        {popularPlaylists?.length !== 0 &&
                            popularPlaylists?.map((item, index) => (
                                <Grid item xl={2} lg={3} md={4} xs={6} key={index}>
                                    <PlaylistItem playlist={item} to={`/playlist/${item._id}`} />
                                </Grid>
                            ))}
                    </Grid>
                </div>
            </section>

            <section className={cx('section-container')}>
                <h1 className={cx('heading')}>Recommend Playlists</h1>
                <div className={cx('section-content')}>
                    <Grid container spacing={2}>
                        {recommendPlaylists?.length !== 0 &&
                            recommendPlaylists?.map((item, index) => (
                                <Grid item xl={2} lg={3} md={4} xs={6} key={index}>
                                    <PlaylistItem playlist={item} to={`/playlist/${item._id}`} />
                                </Grid>
                            ))}
                    </Grid>
                </div>
            </section>

            <section className={cx('section-container')}>
                <h1 className={cx('heading')}>Discover New Playlists</h1>
                <div className={cx('section-content')}>
                    <Grid container spacing={2}>
                        {randomPlaylists?.length !== 0 &&
                            randomPlaylists?.map((item, index) => (
                                <Grid item xl={2} lg={3} md={4} xs={6} key={index}>
                                    <PlaylistItem playlist={item} to={`/playlist/${item._id}`} />
                                </Grid>
                            ))}
                    </Grid>
                </div>
            </section>

            <section className={cx('section-container')}>
                <h1 className={cx('heading')}>Discover New Albums</h1>
                <div className={cx('section-content')}>
                    <Grid container spacing={2}>
                        {randomAlbums?.length !== 0 &&
                            randomAlbums?.map((item, index) => (
                                <Grid item xl={2} lg={3} md={4} xs={6} key={index}>
                                    <AlbumItem album={item} to={`/album/${item._id}`} />
                                </Grid>
                            ))}
                    </Grid>
                </div>
            </section>

            <section className={cx('section-container')}>
                <h1 className={cx('heading')}>Popular Albums</h1>
                <div className={cx('section-content')}>
                    <Grid container spacing={2}>
                        {popularAlbums?.length !== 0 &&
                            popularAlbums?.map((item, index) => (
                                <Grid item xl={2} lg={3} md={4} xs={6} key={index}>
                                    <AlbumItem album={item} to={`/album/${item._id}`} />
                                </Grid>
                            ))}
                    </Grid>
                </div>
            </section>

            <section className={cx('section-container')}>
                <h1 className={cx('heading')}>Saved Playlists</h1>
                <div className={cx('section-content')}>
                    <Grid container spacing={2}>
                        {savedPlaylists?.length !== 0 &&
                            savedPlaylists?.map((item, index) => (
                                <Grid item xl={2} lg={3} md={4} xs={6} key={index}>
                                    {/* Because saved playlists will return different type some we must add .playlist */}
                                    <PlaylistItem playlist={item?.playlist} to={`/playlist/${item.playlist._id}`} />
                                </Grid>
                            ))}
                    </Grid>
                </div>
            </section>
        </div>
    );
};

export default Home;
