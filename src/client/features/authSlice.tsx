import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../app/store.js'
import { api } from './api.js'
import { User } from '@prisma/client'

interface AuthState {
  user: User | null
  token: string | null
}

const initialState: AuthState = {
  user: null,
  token: null 
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null
      state.user = null
    }
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      api.endpoints.register.matchFulfilled,
      (state, { payload }) => {
        state.token = payload.token;
        state.user = payload.user;
      }
    );
    builder.addMatcher(
      api.endpoints.login.matchFulfilled, (state, { payload }) => {
        state.token = payload.token;
        state.user = payload.user;
      }
    );
  }
})

export const { logout } = authSlice.actions;

export default authSlice.reducer

export const selectCurrentUser = (state: RootState) => state.auth.user