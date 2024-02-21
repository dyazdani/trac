import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../app/store.js'
import { api } from './api.js'
import { User } from '@prisma/client'

interface AuthState {
  user: Omit<User, 'password'> | null
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

      localStorage.clear();
    }
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      api.endpoints.register.matchFulfilled,
      (state, { payload }) => {
        const {token, user} = payload;
        if (token && user) {
          state.token = token;
          state.user = user;
  
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user))
        }
      }
    );
    builder.addMatcher(
      api.endpoints.login.matchFulfilled, (state, { payload }) => {
        const {token, user} = payload;
        if (token && user) {
          state.token = token;
          state.user = user;
  
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user))
        }
      }
    );
  }
})

export const { logout } = authSlice.actions;

export default authSlice.reducer

export const selectCurrentUser = (state: RootState) => state.auth.user