import { createSlice } from '@reduxjs/toolkit'
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
  }
})

export const { logout } = authSlice.actions;

export default authSlice.reducer
