import React from 'react';
import classNames from 'classnames/bind';

import styles from './styles.scoped.scss';
import { Grid } from '@mui/material';

import PlaylistItem from '~/components/PlaylistItem';
const cx = classNames.bind(styles);

const Home = () => {
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
                <h1 className={cx('heading')}>Playlist của tôi</h1>
                <div className={cx('section-content')}>
                    <Grid container spacing={1}>
                        <Grid item xl={2} lg={3} md={4} xs={6}>
                            <PlaylistItem />
                        </Grid>
                        <Grid item xl={2} lg={3} md={4} xs={6}>
                            <PlaylistItem />
                        </Grid>
                        <Grid item xl={2} lg={3} md={4} xs={6}>
                            <PlaylistItem />
                        </Grid>
                        <Grid item xl={2} lg={3} md={4} xs={6}>
                            <PlaylistItem />
                        </Grid>
                        <Grid item xl={2} lg={3} md={4} xs={6}>
                            <PlaylistItem />
                        </Grid>
                        <Grid item xl={2} lg={3} md={4} xs={6}>
                            <PlaylistItem />
                        </Grid>
                    </Grid>
                </div>
            </section>
        </div>
    );
};

export default Home;
