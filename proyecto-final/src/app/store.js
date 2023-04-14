import { combineReducers, configureStore } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import authReducer from "../authSlice";
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';


const reducers = combineReducers({
  auth: authReducer
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};

const persistedReducer = persistReducer(persistConfig, reducers);

export default configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});
