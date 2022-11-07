import { routes, roles } from '~/config';
// Layouts
import MainLayout from '~/layouts/MainLayout';
// Pages
import Home from '~/pages/Home';
import Search from '~/pages/Search';
import Artist from '~/pages/Artist';
import Settings from '~/pages/Settings';

const privateRoutes = [
    // Home
    {
        path: routes.home,
        component: Home,
        layout: MainLayout,
        roles: [roles.user, roles.admin, roles.artist],
    },
    // Search
    {
        path: routes.search,
        component: Search,
        layout: MainLayout,
        roles: [roles.admin, roles.artist],
    },
    // Artist
    {
        path: routes.artist,
        component: Artist,
        layout: MainLayout,
        roles: [roles.user, roles.admin, roles.artist],
    },
    {
        path: routes.settings,
        component: Settings,
        layout: MainLayout,
        roles: [roles.admin, roles.artist, roles.user],
    },
];

export default privateRoutes;
