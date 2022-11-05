const baseApiUrl = process.env.REACT_APP_API_URL;

// [GET] (admin)
export const getAlbumsInfoUrl = baseApiUrl + '/albums/info';

// [GET] (admin)
export const getAlbumsByContextUrl = baseApiUrl + '/albums/context';

// [DELETE] (admin, artist owner)
export const deleteAlbumUrl = (id) => baseApiUrl + `/albums/${id}`;

// [PUT] (admin, artist owner)
export const toggleReleaseAlbumUrl = (id) => baseApiUrl + `/albums/${id}/release`;

// [DELETE] reomve track from album
export const removeTrackFromAlbumUrl = (id) => baseApiUrl + `/albums/${id}/tracks`;
