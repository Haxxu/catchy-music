import React from 'react';

import Navbar from '~/components/Navbar';
import Sidebar from '~/components/Sidebar';
import Footer from '~/components/Footer';

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
            <div>
                <Footer />
            </div>
        </div>
    );
};

export default MainLayout;
