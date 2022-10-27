import { routes } from '~/config';

// Layouts
import MainLayout from '~/layouts/MainLayout';

// Pages
import Home from '~/pages/Home';
import Search from '~/pages/Search';
import Artist from '~/pages/Artist';

const roles = {
    user: 'user',
    admin: 'admin',
    artist: 'artist',
};

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
        roles: [roles.admin, roles.artist],
    },
];

export default privateRoutes;
