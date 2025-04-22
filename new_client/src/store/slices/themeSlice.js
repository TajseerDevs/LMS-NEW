import { createSlice } from '@reduxjs/toolkit'

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    darkMode: false,
  },
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload
    },
  },
})


export const { toggleDarkMode, setDarkMode } = themeSlice.actions

export {themeSlice}
