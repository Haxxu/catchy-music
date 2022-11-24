import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';

import styles from './styles.scoped.scss';
import { Grid } from '@mui/material';

import PlaylistItem from '~/components/PlaylistItem';
import axiosInstance from '~/api/axiosInstance';
import { getPlaylistsByTagsUrl } from '~/api/urls/playlistsUrl';
import { getSavedPlaylistsUrl } from '~/api/urls/me';
const cx = classNames.bind(styles);

const Home = () => {
    const [popularPlaylists, setPopularPlaylists] = useState([]);
    const [recommendPlaylists, setRecommendPlaylists] = useState([]);
    const [randomPlaylists, setRandomPlaylists] = useState([]);
    const [savedPlaylists, setSavedPlaylists] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await axiosInstance.get(getPlaylistsByTagsUrl, {
                params: {
                    tags: ['popular', 'recommend', 'random'],
                },
            });
            setPopularPlaylists(data.data.popularPlaylists);
            setRecommendPlaylists(data.data.recommendPlaylists);
            setRandomPlaylists(data.data.randomPlaylists);

            const { data: savedPlaylistsRes } = await axiosInstance(getSavedPlaylistsUrl);
            setSavedPlaylists(savedPlaylistsRes.data);

            // console.log(savedPlaylistsRes.data);
            console.log(savedPlaylists);
        };

        fetchData().catch(console.error);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={cx('container')}>
            <section className={cx('section-container')}>
                <h1 className={cx('heading')}>Chào buổi trưa</h1>
                <div className={cx('section-content')}>
                    <Grid container spacing={1}>
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
                <h1 className={cx('heading')}>Popular Playlists</h1>
                <div className={cx('section-content')}>
                    <Grid container spacing={1}>
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
                    <Grid container spacing={1}>
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
                    <Grid container spacing={1}>
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
                <h1 className={cx('heading')}>Saved Playlists</h1>
                <div className={cx('section-content')}>
                    <Grid container spacing={1}>
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
