import { TOrder } from '@utils-types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getOrdersApi } from '../../utils/burger-api';

type TOrdersState = {
  orders: TOrder[];
  isLoad: boolean;
};

export const initialState: TOrdersState = {
  orders: [],
  isLoad: false
};

export const getOrders = createAsyncThunk('orders/get', async () => {
  const res = await getOrdersApi();
  return res;
});

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  selectors: {
    ordersSelector: (state) => state.orders
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        state.isLoad = true;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.isLoad = false;
      })
      .addCase(getOrders.rejected, (state) => {
        state.orders = [];
        state.isLoad = false;
      });
  }
});

export const ordersReducer = ordersSlice.reducer;
export const { ordersSelector } = ordersSlice.selectors;
