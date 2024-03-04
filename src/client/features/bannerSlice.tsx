import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface BannerState {
  isBannerDisplayed: boolean | null
}

const initialState: BannerState = {
    isBannerDisplayed: null
}

export const bannerSlice = createSlice({
  name: 'banner',
  initialState,
  reducers: {
    setIsBannerDisplayed: (state, action: PayloadAction<boolean | null>) => {
      state.isBannerDisplayed = action.payload

      localStorage.setItem("isBannerDisplayed", JSON.stringify(action.payload))
    },
    resetIsBannerDisplayed: (state) => {
        state.isBannerDisplayed = null;

        localStorage.clear();
    }
  },
})

export const { setIsBannerDisplayed, resetIsBannerDisplayed } = bannerSlice.actions;

export default bannerSlice.reducer