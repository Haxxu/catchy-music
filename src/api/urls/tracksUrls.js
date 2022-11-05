const baseApiUrl = process.env.REACT_APP_API_URL;

// [GET]
export const getTracksInfoUrl = baseApiUrl + '/tracks/info';

// [GET]
export const getTracksByContextUrl = baseApiUrl + '/tracks/context';

// [DELETE]
export const deleteTrackUrl = (id) => baseApiUrl + `/tracks/${id}`;
