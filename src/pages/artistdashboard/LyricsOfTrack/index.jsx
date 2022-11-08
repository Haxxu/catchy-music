import React from 'react';
import { useParams } from 'react-router-dom';

const LyricsOfTrack = () => {
    const { id } = useParams();
    return <div>LyricsOfTrack {id}</div>;
};

export default LyricsOfTrack;
