import React from 'react';

import Navbar from '~/components/artist/Navbar';
import Sidebar from '~/components/artist/Sidebar';

const ArtistDashboardLayout = ({ children }) => {
    return (
        <div>
            <div>
                <Navbar />
            </div>
            <div>
                <Sidebar />
            </div>
            <div>{children}</div>
        </div>
    );
};

export default ArtistDashboardLayout;
