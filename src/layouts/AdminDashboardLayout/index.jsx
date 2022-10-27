import React from 'react';

import Sidebar from '~/components/admin/Sidebar';
import Navbar from '~/components/admin/Navbar';

const AdminDashboardLayout = ({ children }) => {
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

export default AdminDashboardLayout;
