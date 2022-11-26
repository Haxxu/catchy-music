import { createSlice } from '@reduxjs/toolkit';

const updateState = createSlice({
    name: 'updateState',
    initialState: {
        likeTrackState: false,
    },
    reducers: {
        updateLikeTrackState: (state, payload) => {
            state.likeTrackState = !state.likeTrackState;
        },
    },
});

export const updateStateReducer = updateState.reducer;
export const { updateLikeTrackState } = updateState.actions;

export default updateState;
