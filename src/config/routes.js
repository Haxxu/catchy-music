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
    admin_dashboard: '/admin-dashboard/home',
    admin_dashboard_profile: '/admin-dashboard/profile',
    admin_dashboard_settings: '/admin-dashboard/settings',

    admin_manageUser: '/admin-dashboard/users',
    admin_manageArtist: '/admin-dashboard/artists',
    admin_manageTrack: '/admin-dashboard/tracks',
    admin_manageAlbum: '/admin-dashboard/albums',
    admin_managePlaylist: '/admin-dashboard/playlists',

    // artist routes
    artist_dashboard: '/artist-dashboard',
    artist_manageTrack: '/artist-dashboard/manage-track',
};

export default routes;
