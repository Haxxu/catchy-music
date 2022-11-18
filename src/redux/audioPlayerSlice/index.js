import { createSlice } from '@reduxjs/toolkit';

const audioPlayer = createSlice({
    name: 'audioPlayer',
    initialState: {},
    reducers: {},
});

export const audioPlayerReducer = audioPlayer.reducer;

export default audioPlayer;
