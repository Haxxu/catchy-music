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

    settings: '/settings',

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
    admin_manageGenre_genreForm: '/admin-dashboard/genres/:id',

    // artist routes
    artist_dashboard: '/artist-dashboard/home',
    artist_manageTrack: '/artist-dashboard/tracks',
    artist_manageTrack_newTrack: '/artist-dashboard/tracks/new-track',
    artist_manageTrack_specifiedTrack: '/artist-dashboard/tracks/:id/*',
    artist_manageTrack_specifiedTrack_nested_edit: '',
    artist_manageTrack_specifiedTrack_nested_albumsOfTrack: 'albums',
    artist_manageTrack_specifiedTrack_nested_lyricsOfTrack: 'lyrics',

    artist_manageAlbum: '/artist-dashboard/albums',
};

export default routes;
