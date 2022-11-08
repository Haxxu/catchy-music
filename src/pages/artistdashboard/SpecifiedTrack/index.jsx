import React from 'react';
import { NavLink, Route, Routes, useParams } from 'react-router-dom';

import TrackForm from '~/components/Forms/TrackForm';
import AlbumsOfTrack from '~/pages/artistdashboard/AlbumsOfTrack';
import LyricsOfTrack from '~/pages/artistdashboard/LyricsOfTrack';
import GenresOfTrack from '~/pages/artistdashboard/GenresOfTrack';
import { routes } from '~/config';

const SpecifiedTrack = () => {
    const { id } = useParams();

    return (
        <div>
            {id !== 'new-track' && (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <NavLink to={routes.artist_manageTrack_specifiedTrack_nested_edit}>Edit</NavLink>
                    <NavLink to={routes.artist_manageTrack_specifiedTrack_nested_albumsOfTrack}>Albums</NavLink>
                    <NavLink to={routes.artist_manageTrack_specifiedTrack_nested_lyricsOfTrack}>Lyrics</NavLink>
                    <NavLink to={routes.artist_manageTrack_specifiedTrack_nested_genresOfTrack}>Genre</NavLink>
                </div>
            )}
            <div>
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
