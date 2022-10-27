const routes = {
    // public routes
    signup: '/signup',
    login: '/login',
    unAuthorized: '/unauthorized',
    notFound: '/not-found',

    // private routes
    home: '/',
    search: '/search',
    artist: '/artist/:artistId',

    // admin routes
    admin_dashboard: '/admin-dashboard',
    admin_manageUser: '/admin-dashboard/manage-user',

    // artist routes
    artist_dashboard: '/artist-dashboard',
    artist_manageTrack: '/artist-dashboard/manage-track',
};

export default routes;
