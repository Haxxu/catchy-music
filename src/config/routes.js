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
    admin_profile: '/admin-dashboard/profile',
    admin_settings: '/admin-dashboard/settings',

    admin_manageUser: '/admin-dashboard/users',
    admin_manageArtist: '/admin-dashboard/artists',
    admin_manageTrack: '/admin-dashboard/tracks',
    admin_manageAlbum: '/admin-dashboard/albums',
    admin_managePlaylist: '/admin-dashboard/playlists',
    admin_manageGenre: '/admin-dashboard/genres',

    // artist routes
    artist_dashboard: '/artist-dashboard',
    artist_manageTrack: '/artist-dashboard/manage-track',
};

export default routes;
