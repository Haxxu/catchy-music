import React from 'react';
import classNames from 'classnames/bind';
import { NavLink, Route, Routes } from 'react-router-dom';

import styles from './styles.scoped.scss';
import { routes } from '~/config';
import SavedPlaylists from '~/pages/SavedPlaylists';
import SavedAlbums from '~/pages/SavedAlbums';
import FollowingArtists from '~/pages/FollowingArtists';

const cx = classNames.bind(styles);

const Library = () => {
    return (
        <div className={cx('container')}>
            <div className={cx('subnav')}>
                <NavLink className={cx('subnav-item')} to={routes.library_playlists}>
                    Playlists
                </NavLink>
                <NavLink className={cx('subnav-item')} to={routes.library_albums}>
                    Albums
                </NavLink>
                <NavLink className={cx('subnav-item')} to={routes.library_artists}>
                    Artists
                </NavLink>
            </div>
            <div className={cx('main')}>
                <Routes>
                    <Route path={routes.library_playlists} element={<SavedPlaylists />} />
                    <Route path={routes.library_albums} element={<SavedAlbums />} />
                    <Route path={routes.library_artists} element={<FollowingArtists />} />
                </Routes>
            </div>
        </div>
    );
};

export default Library;
