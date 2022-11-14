import React from 'react';
import { NavLink, Route, Routes, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';

import AlbumForm from '~/components/Forms/AlbumForm';
import AlbumsOfTrack from '~/pages/artistdashboard/AlbumsOfTrack';
import TracksOfAlbum from '~/pages/artistdashboard/TracksOfAlbum';
import { routes } from '~/config';
import styles from './styles.scoped.scss';

const cx = classNames.bind(styles);

const SpecifiedAlbum = () => {
    const { id } = useParams();

    return (
        <div className={cx('container')}>
            {id !== 'new-album' && (
                <div className={cx('subnav')}>
                    <NavLink
                        end
                        className={cx('subnav-item')}
                        to={routes.artist_manageAlbum_specifiedAlbum_nested_edit}
                    >
                        Edit
                    </NavLink>
                    <NavLink
                        className={cx('subnav-item')}
                        to={routes.artist_manageAlbum_specifiedAlbum_nested_tracksOfAlbum}
                    >
                        Tracks
                    </NavLink>
                </div>
            )}
            <div className={cx('main')}>
                <Routes>
                    <Route path='' element={<AlbumForm />} />
                    {id !== 'new-album' && <Route path='tracks' element={<TracksOfAlbum />} />}
                </Routes>
            </div>
        </div>
    );
};

export default SpecifiedAlbum;
