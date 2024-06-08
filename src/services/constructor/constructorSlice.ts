import { TConstructorIngredient, TOrder } from '@utils-types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../../utils/burger-api';
import { createAsyncThunk } from '@reduxjs/toolkit';

type TConstructorItems = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

type TBurgerConstructorState = {
  constructorItems: TConstructorItems;
  orderRequest: boolean;
  orderModalData: TOrder | null;
};

export const initialState: TBurgerConstructorState = {
  constructorItems: { bun: null, ingredients: [] },
  orderRequest: false,
  orderModalData: null
};

export const postOrderBurger = createAsyncThunk(
  'orders/post',
  async (data: string[]) => {
    const res = await orderBurgerApi(data);
    return res;
  }
);

export const constructorSlice = createSlice({
  name: 'burger',
  initialState,
  reducers: {
    addIngredients: (state, action: PayloadAction<TConstructorIngredient>) => {
      if (action.payload.type === 'bun') {
        state.constructorItems.bun = action.payload;
      } else {
        state.constructorItems?.ingredients?.push(action.payload);
      }
    },
    deleteIngredients: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients?.filter(
          (item) => item.id !== action.payload.id
        );
    },
    moveIngredientsDown: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      const ingredients = state.constructorItems.ingredients;
      const ingredient = ingredients[index];
      ingredients.splice(index, 1);
      ingredients.splice(index + 1, 0, ingredient);
    },
    moveIngredientsUp: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      const ingredients = state.constructorItems.ingredients;
      const ingredient = ingredients[index];
      ingredients.splice(index, 1);
      ingredients.splice(index - 1, 0, ingredient);
    },
    clearConstructor: (state) => {
      state.constructorItems.bun = null;
      state.constructorItems.ingredients = [];
    },
    setOrderRequest: (state, action: PayloadAction<boolean>) => {
      state.orderRequest = action.payload;
    },
    setOrderModalData: (state, action: PayloadAction<TOrder | null>) => {
      state.orderModalData = action.payload;
    }
  },
  selectors: {
    constructorSelector: (state) => state.constructorItems,
    orderRequestSelector: (state) => state.orderRequest,
    orderModalDataSelector: (state) => state.orderModalData
  },
  extraReducers: (builder) => {
    builder
      .addCase(postOrderBurger.fulfilled, (state, action) => {
        state.orderModalData = action.payload.order;
      })
      .addCase(postOrderBurger.pending, (state) => {
        state.orderRequest = true;
      });
  }
});

export const {
  addIngredients,
  deleteIngredients,
  moveIngredientsDown,
  moveIngredientsUp,
  clearConstructor,
  setOrderRequest,
  setOrderModalData
} = constructorSlice.actions;

export const {
  constructorSelector,
  orderModalDataSelector,
  orderRequestSelector
} = constructorSlice.selectors;

export const constructorReducer = constructorSlice.reducer;
