const baseApiUrl = process.env.REACT_APP_API_URL;

// [GET]
export const getCurrentUserProfileUrl = baseApiUrl + '/me';

// [GET] get saved playlists
export const getSavedPlaylistsUrl = baseApiUrl + '/me/playlists';

// [GET] get audio player state
export const getAudioPlayerStateUrl = baseApiUrl + '/me/audio-player';

// [GET] get audio player state
export const getCurrentlyPlayingTrackUrl = baseApiUrl + '/me/audio-player/currently-playing';

// [PUT] set volume
export const setVolumeUrl = baseApiUrl + '/me/audio-player/volume';

// [PUT] pause track
export const pauseTrackUrl = baseApiUrl + '/me/audio-player/pause';

// [PUT] play track
export const playTrackUrl = baseApiUrl + '/me/audio-player/play';

// [POST] skip next
export const skipNextUrl = baseApiUrl + '/me/audio-player/next';

// [POST] skip previous
export const skipPreviousUrl = baseApiUrl + '/me/audio-player/previous';

// [PUT] set repeat mode
export const setShuffleModeUrl = baseApiUrl + '/me/audio-player/shuffle';

// [PUT] set repeat mode
export const setRepeatModeUrl = baseApiUrl + '/me/audio-player/repeat';
