import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'modal',
  initialState: {
    extra: null,
    isOpened: false,
    type: null,
  },
  reducers: {
    closeModal: (state) => {
      state.isOpened = false;
      state.type = null;
      state.extra = null;
    },
    openModal: (state, { payload }) => {
      const { type, extra } = payload;

      state.isOpened = true;
      state.type = type;
      state.extra = extra ?? null;
    },
  },
});

export const { actions } = slice;

export default slice.reducer;
