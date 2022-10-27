import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: null,
        isFetching: false,
        error: false,
    },
    reducers: {
        loginStart: (state) => {
            state.isFetching = true;
        },
        loginSuccess: (state, action) => {
            state.token = action.payload.token;
            state.isFetching = false;
        },
        loginFailure: (state) => {
            state.error = true;
            state.isFetching = false;
        },
        logout: (state) => {
            state.token = null;
            state.isFetching = false;
        },
    },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;

export const authReducer = authSlice.reducer;

export const selectCurrentToken = (state) => state.auth.token;

export default authSlice;
