import { routes, roles } from '~/config';
// Layouts
import ArtistDashboardLayout from '~/layouts/ArtistDashboardLayout';
// Pages
import Dashboard from '~/pages/artistdashboard/Dashboard';
import ManageTrack from '~/pages/artistdashboard/ManageTrack';

const artistRoutes = [
    // dashboard
    {
        path: routes.artist_dashboard,
        component: Dashboard,
        layout: ArtistDashboardLayout,
        roles: [roles.artist],
    },
    {
        path: routes.artist_manageTrack,
        component: ManageTrack,
        layout: ArtistDashboardLayout,
        roles: [roles.artist],
    },
];

export default artistRoutes;
