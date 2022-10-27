import React from 'react';

import Navbar from '~/components/Navbar';
import Sidebar from '~/components/Sidebar';

const MainLayout = ({ children }) => {
    return (
        <div>
            <div>
                <Sidebar />
            </div>
            <div>
                <Navbar />
                {children}
            </div>
        </div>
    );
};

export default MainLayout;
