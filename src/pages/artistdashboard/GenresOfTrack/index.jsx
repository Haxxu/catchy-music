import React from 'react';
import { useParams } from 'react-router-dom';

const GenresOfTrack = () => {
    const { id } = useParams();
    return <div>GenresOfTrack {id}</div>;
};

export default GenresOfTrack;
