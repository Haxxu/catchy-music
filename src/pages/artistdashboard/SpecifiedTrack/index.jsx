import React from 'react';
import { NavLink, Route, Routes, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';

import TrackForm from '~/components/Forms/TrackForm';
import AlbumsOfTrack from '~/pages/artistdashboard/AlbumsOfTrack';
import LyricsOfTrack from '~/pages/artistdashboard/LyricsOfTrack';
import GenresOfTrack from '~/pages/artistdashboard/GenresOfTrack';
import { routes } from '~/config';
import styles from './styles.scoped.scss';

const cx = classNames.bind(styles);

const SpecifiedTrack = () => {
    const { id } = useParams();

    return (
        <div className={cx('container')}>
            {id !== 'new-track' && (
                <div className={cx('navigation')}>
                    <NavLink to={routes.artist_manageTrack_specifiedTrack_nested_edit}>Edit</NavLink>
                    <NavLink to={routes.artist_manageTrack_specifiedTrack_nested_albumsOfTrack}>Albums</NavLink>
                    <NavLink to={routes.artist_manageTrack_specifiedTrack_nested_lyricsOfTrack}>Lyrics</NavLink>
                    <NavLink to={routes.artist_manageTrack_specifiedTrack_nested_genresOfTrack}>Genre</NavLink>
                </div>
            )}
            <div className={cx('')}>
                <Routes>
                    <Route path='' element={<TrackForm />} />
                    {id !== 'new-track' && <Route path='albums' element={<AlbumsOfTrack />} />}
                    {id !== 'new-track' && <Route path='lyrics' element={<LyricsOfTrack />} />}
                    {id !== 'new-track' && <Route path='genres' element={<GenresOfTrack />} />}
                </Routes>
            </div>
        </div>
    );
};

export default SpecifiedTrack;
