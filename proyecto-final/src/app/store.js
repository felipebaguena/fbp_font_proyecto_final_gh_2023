import { combineReducers, configureStore } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import authReducer from "../authSlice";
import heroReducer from "../heroSlice";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";

const reducers = combineReducers({
  auth: authReducer,
  hero: heroReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "hero"],
};

const persistedReducer = persistReducer(persistConfig, reducers);

export default configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});
