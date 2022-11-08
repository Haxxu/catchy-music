import React from 'react';
import { Link } from 'react-router-dom';

import { routes } from '~/config';

const ManageTrack = () => {
    return (
        <div>
            <div>
                <Link to={routes.artist_manageTrack_newTrack}> Add new album</Link>
            </div>
            <div>
                <div>
                    <Link to={routes.artist_manageTrack + '/1'}>Track 1</Link>
                </div>
                <div>
                    <Link to={routes.artist_manageTrack + '/2'}>Track 2</Link>
                </div>
                <div>
                    <Link to={routes.artist_manageTrack + '/3'}>Track 3</Link>
                </div>
            </div>
        </div>
    );
};

export default ManageTrack;
