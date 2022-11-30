import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { Grid } from '@mui/material';

import styles from './styles.scoped.scss';
import { getFollowingUsersUrl } from '~/api/urls/me';
import axiosInstance from '~/api/axiosInstance';
import UserItem from '~/components/UserItem';

const cx = classNames.bind(styles);

const FollowingArtists = () => {
    const [artists, setArtists] = useState();

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await axiosInstance.get(getFollowingUsersUrl);
            setArtists(data.data.artists);
            console.log(data.data.artists);
        };

        fetchData().catch(console.error);
    }, []);

    return (
        <div className={cx('container')}>
            <section className={cx('section-container')}>
                <h1 className={cx('heading')}>Artists</h1>
                <div className={cx('section-content')}>
                    <Grid container spacing={2}>
                        {artists?.length !== 0 &&
                            artists?.map((item, index) => (
                                <Grid item xl={2} lg={3} md={4} xs={6} key={index}>
                                    <UserItem
                                        name={item.name}
                                        image={item.image}
                                        type={item.type}
                                        to={`/${item?.type}/${item?._id}`}
                                    />
                                </Grid>
                            ))}
                    </Grid>
                </div>
            </section>
        </div>
    );
};

export default FollowingArtists;
