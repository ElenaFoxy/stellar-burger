import { configureStore, combineReducers } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import { authReducer } from './auth/authSlice';
import { ingredientsReducer } from './ingredients/ingredientsSlice';
import { constructorReducer } from './constructor/constructorSlice';
import { feedReducer } from './feed/feedSlice';
import { ordersReducer } from './orders/ordersSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  ingredients: ingredientsReducer,
  burger: constructorReducer,
  feed: feedReducer,
  orders: ordersReducer
}); // Заменить на импорт настоящего редьюсера

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
