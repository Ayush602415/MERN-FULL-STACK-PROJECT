import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
    name: "notifications",
    initialState: {
        items: []
    },
    reducers: {
        addNotification: (state, action) => {
            state.items.unshift(action.payload);
        },
        markNotificationAsRead: (state, action) => {
            const notification = state.items.find((item) => item.id === action.payload);
            if (notification) notification.read = true;
        },
        dismissNotification: (state, action) => {
            state.items = state.items.filter((item) => item.id !== action.payload);
        },
        clearNotifications: (state) => {
            state.items = [];
        }
    }
});

export const {
    addNotification,
    markNotificationAsRead,
    dismissNotification,
    clearNotifications
} = notificationSlice.actions;

export default notificationSlice.reducer;
