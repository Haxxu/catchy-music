import React from 'react';
import { useParams } from 'react-router-dom';

const Artist = () => {
    const { artistId } = useParams();

    return <div>Artist {artistId}</div>;
};

export default Artist;
