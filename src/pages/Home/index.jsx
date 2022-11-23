import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';

import styles from './styles.scoped.scss';
import { Grid } from '@mui/material';

import PlaylistItem from '~/components/PlaylistItem';
import axiosInstance from '~/api/axiosInstance';
import { getPopularPlaylistsUrl } from '~/api/urls/playlistsUrl';
const cx = classNames.bind(styles);

const Home = () => {
    const [popularPlaylists, setPopularPlaylists] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const { data: popularPlaylistsRes } = await axiosInstance.get(getPopularPlaylistsUrl);
            setPopularPlaylists(popularPlaylistsRes.data);

            console.log(popularPlaylists);
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
                        <Grid item xl={4} md={6} xs={12}>
                            <PlaylistItem type='reduce' />
                        </Grid>
                        <Grid item xl={4} md={6} xs={12}>
                            <PlaylistItem type='reduce' />
                        </Grid>
                        <Grid item xl={4} md={6} xs={12}>
                            <PlaylistItem type='reduce' />
                        </Grid>
                        <Grid item xl={4} md={6} xs={12}>
                            <PlaylistItem type='reduce' />
                        </Grid>
                        <Grid item xl={4} md={6} xs={12}>
                            <PlaylistItem type='reduce' />
                        </Grid>
                        <Grid item xl={4} md={6} xs={12}>
                            <PlaylistItem type='reduce' />
                        </Grid>
                    </Grid>
                </div>
            </section>

            <section className={cx('section-container')}>
                <h1 className={cx('heading')}>Popular Playlists</h1>
                <div className={cx('section-content')}>
                    <Grid container spacing={1}>
                        {popularPlaylists.length !== 0 &&
                            popularPlaylists.map((item, index) => (
                                <Grid item xl={2} lg={3} md={4} xs={6} key={index}>
                                    <PlaylistItem playlist={item} to={`/playlist/${item._id}`} />
                                </Grid>
                            ))}
                    </Grid>
                </div>
            </section>
        </div>
    );
};

export default Home;
