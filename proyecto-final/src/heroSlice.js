import { createSlice } from "@reduxjs/toolkit";

const heroSlice = createSlice({
  name: "hero",
  initialState: {
    hero_id: null,
  },
  reducers: {
    setHeroId: (state, action) => {
      state.hero_id = action.payload;
    },
  },
});

export const { setHeroId } = heroSlice.actions;
export default heroSlice.reducer;
