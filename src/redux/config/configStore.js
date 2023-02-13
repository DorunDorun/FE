// src/redux/config/configStore.js

import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";


const store = configureStore({
  reducer: {

  },
  // devTools: process.env.NODE_ENV !== "production",
  // middleware: getDefaultMiddleware({
    // serializableCheck: false,
  // }),
});

export default store;
