import { routes, roles } from '~/config';
// Layouts
import MainLayout from '~/layouts/MainLayout';
// Pages
import Home from '~/pages/Home';
import Search from '~/pages/Search';
import Artist from '~/pages/Artist';
import Settings from '~/pages/Settings';
import Profile from '~/pages/Profile';

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
    // Settings
    {
        path: routes.settings,
        component: Settings,
        layout: MainLayout,
        roles: [roles.admin, roles.artist, roles.user],
    },
    // Profile
    {
        path: routes.profile,
        component: Profile,
        layout: MainLayout,
        roles: [roles.admin, roles.artist, roles.user],
    },
];

export default privateRoutes;
