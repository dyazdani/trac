import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import authSliceReducer from '../features/authSlice.js';
import api from '../features/api.js';

export const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
        auth: authSliceReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware)
})

setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {auth: AuthState}
export type AppDispatch = typeof store.dispatch

export default store;
