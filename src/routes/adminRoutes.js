import { routes, roles } from '~/config';
// Layouts
import AdminDashboardLayout from '~/layouts/AdminDashboardLayout';
// Pages
import Dashboard from '~/pages/admindashboard/Dashboard';
import ManageUser from '~/pages/admindashboard/ManageUser';
import Profile from '~/pages/Profile';
import Settings from '~/pages/Settings';

const adminRoutes = [
    {
        path: routes.admin_profile,
        component: Profile,
        layout: AdminDashboardLayout,
        roles: [roles.admin],
    },
    {
        path: routes.admin_settings,
        component: Settings,
        layout: AdminDashboardLayout,
        roles: [roles.admin],
    },
    // dashboard
    {
        path: routes.admin_dashboard,
        component: Dashboard,
        layout: AdminDashboardLayout,
        roles: [roles.admin],
    },
    {
        path: routes.admin_manageUser,
        component: ManageUser,
        layout: AdminDashboardLayout,
        roles: [roles.admin],
    },
];

export default adminRoutes;
