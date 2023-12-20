import { configureStore } from '@reduxjs/toolkit';

import authSliceReducer from '../features/authSlice.js';

export const store = configureStore({
    reducer: {
        auth: authSliceReducer
    }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {auth: AuthState}
export type AppDispatch = typeof store.dispatch

export default store;
