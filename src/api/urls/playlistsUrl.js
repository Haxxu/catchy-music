const baseApiUrl = process.env.REACT_APP_API_URL;

// [GET]
export const getPlaylistsInfoUrl = baseApiUrl + '/playlists/info';

// [GET]
export const getPlaylistsByContextUrl = baseApiUrl + '/playlists/context';

// [PUT]
export const togglePublicPlaylistUrl = (id) => baseApiUrl + `/playlists/${id}/toggle-public`;

// [DELETE]
export const deletePlaylistUrl = (id) => baseApiUrl + `/playlists/${id}`;

// [DELETE] reomve track from playlist
export const removeTrackFromPlaylistUrl = (id) => baseApiUrl + `/playlists/${id}/tracks`;
