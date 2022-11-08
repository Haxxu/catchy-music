import React from 'react';
import { useParams } from 'react-router-dom';

const AlbumsOfTrack = () => {
    const { id } = useParams();
    return <div>AlbumsOfTrack {id}</div>;
};

export default AlbumsOfTrack;
