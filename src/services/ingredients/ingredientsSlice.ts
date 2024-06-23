import { TIngredient } from '@utils-types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';
import { createAsyncThunk } from '@reduxjs/toolkit';

type TIngredientsState = {
  ingredients: TIngredient[] | null;
  isLoad: boolean;
};

export const initialState: TIngredientsState = {
  ingredients: null,
  isLoad: false
};

export const getIngredients = createAsyncThunk(
  'ingredients',
  getIngredientsApi
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    loading: (state, action: PayloadAction<boolean>) => {
      state.isLoad = action.payload;
    },
    setIngredients: (state, action: PayloadAction<TIngredient[]>) => {
      state.ingredients = action.payload;
    }
  },
  selectors: {
    ingredientsSelector: (state) => state.ingredients,
    loadingSelector: (state) => state.isLoad
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.isLoad = true;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.ingredients = action.payload;
        state.isLoad = false;
      });
  }
});

export const { loading, setIngredients } = ingredientsSlice.actions;

export const { ingredientsSelector, loadingSelector } =
  ingredientsSlice.selectors;

export const ingredientsReducer = ingredientsSlice.reducer;
