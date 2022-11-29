import { createSlice } from '@reduxjs/toolkit';

const updateState = createSlice({
    name: 'updateState',
    initialState: {
        likeTrackState: false,
        playlistState: false,
        playlistsInSidebarState: false,
        userProfileState: false,
    },
    reducers: {
        updateLikeTrackState: (state, payload) => {
            state.likeTrackState = !state.likeTrackState;
        },

        updatePlaylistState: (state, payload) => {
            state.playlistState = !state.playlistState;
        },

        updatePlaylistInSidebarState: (state, payload) => {
            state.playlistsInSidebarState = !state.playlistsInSidebarState;
        },

        updateUserProfileState: (state, payload) => {
            state.userProfileState = !state.userProfileState;
        },
    },
});

export const updateStateReducer = updateState.reducer;
export const {
    updateLikeTrackState,
    updatePlaylistState,
    updatePlaylistInSidebarState,
    updateUserProfileState,
} = updateState.actions;

export default updateState;
