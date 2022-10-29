import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import { persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { authReducer } from './authSlice';
import { userInterfaceReducer } from './userInterfaceSlice';
import { userReducer } from './userSlice';

const reducers = combineReducers({
    auth: authReducer,
    userInterface: userInterfaceReducer,
    user: userReducer,
});

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth', 'userInterface', 'user'],
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);

export default store;
