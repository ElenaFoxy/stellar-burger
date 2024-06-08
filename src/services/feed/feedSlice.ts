import { TOrder } from '@utils-types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getFeedsApi, getOrderByNumberApi } from '../../utils/burger-api';
import { createAsyncThunk } from '@reduxjs/toolkit';

type TFeedState = {
  orders: TOrder[];
  order: TOrder | null;
  total: number;
  totalToday: number;
};

export const initialState: TFeedState = {
  orders: [],
  order: null,
  total: 0,
  totalToday: 0
};

export const getFeed = createAsyncThunk('orders/all', async () => {
  const res = await getFeedsApi();
  return res;
});

export const getOrderById = createAsyncThunk(
  'orders/getOrderById',
  async (id: number) => {
    const res = await getOrderByNumberApi(id);
    return res.orders;
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<TOrder[]>) => {
      state.orders = action.payload;
    },
    setTotal: (state, action: PayloadAction<number>) => {
      state.total = action.payload;
    },
    setTotalToday: (state, action: PayloadAction<number>) => {
      state.totalToday = action.payload;
    },
    setOrder: (state, action: PayloadAction<TOrder>) => {
      state.order = action.payload;
    }
  },
  selectors: {
    ordersSelector: (state) => state.orders,
    orderSelector: (state) => state.order,
    totalSelector: (state) => state.total,
    totalTodaySelector: (state) => state.totalToday
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeed.fulfilled, (state, action) => {
        state.orders = action.payload.orders.filter((item) => item._id != null);
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.order = action.payload[0];
      })
      .addCase(getOrderById.rejected, (state) => {
        state.order = null;
      });
  }
});

export const { setOrders, setTotal, setTotalToday, setOrder } =
  feedSlice.actions;
export const feedReducer = feedSlice.reducer;

export const {
  orderSelector,
  ordersSelector,
  totalSelector,
  totalTodaySelector
} = feedSlice.selectors;
