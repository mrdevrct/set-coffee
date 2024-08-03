import { configureStore } from "@reduxjs/toolkit";
import menuReducer from "@/lib/redux/store/menuSlice";

const store = configureStore({
  reducer: {
    menu: menuReducer,
  },
});

export default store;
