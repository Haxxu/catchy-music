import React from 'react';
import classNames from 'classnames/bind';
import { Grid } from '@mui/material';

import styles from './styles.scoped.scss';
import { useDebounce } from '~/hooks';
import { useEffect } from 'react';

const cx = classNames.bind(styles);

const SearchResults = ({ searchInput }) => {
    const debouncedValue = useDebounce(searchInput, 500);

    useEffect(() => {}, [debouncedValue]);

    return (
        <div className={cx('container')}>
            <div className={cx('heading')}>Search results: {searchInput}</div>
            <section className={cx('section-container')}>
                <h1 className={cx('heading')}>Playlists</h1>
                <div className={cx('section-content')}>
                    <Grid container spacing={2}>
                        {/* {savedPlaylists?.length !== 0 &&
                            savedPlaylists?.map((item, index) => (
                                <Grid item xl={2} lg={3} md={4} xs={6} key={index}>
                                    <PlaylistItem playlist={item?.playlist} to={`/playlist/${item?.playlist?._id}`} />
                                </Grid>
                            ))} */}
                    </Grid>
                </div>
            </section>
        </div>
    );
};

export default SearchResults;
