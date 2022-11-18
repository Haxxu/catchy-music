const baseApiUrl = process.env.REACT_APP_API_URL;

// [GET]
export const getCurrentUserProfileUrl = baseApiUrl + '/me';

// [GET] get saved playlists
export const getSavedPlaylistsUrl = baseApiUrl + '/me/playlists';
