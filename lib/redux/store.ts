import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import eventReducer from "./features/eventSlice";
import ticketReducer from "./features/ticketSlice";
import orderReducer from "./features/orderSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventReducer,
    tickets: ticketReducer,
    orders: orderReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;