import { createSlice } from '@reduxjs/toolkit'

const messageSlice = createSlice({
    name: "user",
    initialState: {
        unreadCount: 0,
    },
    reducers: {
        setUnreadCount: (state, action) => {
            state.unreadCount = action.payload;
        },
    },
});

export const { setUnreadCount } = messageSlice.actions;

export default messageSlice.reducer;