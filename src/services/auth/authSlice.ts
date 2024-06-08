import { TUser } from '@utils-types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  registerUserApi,
  loginUserApi,
  logoutApi,
  TRegisterData,
  TLoginData,
  getUserApi,
  updateUserApi
} from '../../utils/burger-api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';

type TAuthState = {
  user: TUser | null;
  isAuthChecked: boolean;
  errorMessage: string;
};

const initialState: TAuthState = {
  user: null,
  isAuthChecked: false,
  errorMessage: ''
};

//регистрация пользователя
export const register = createAsyncThunk(
  'auth/register',
  async (userData: TRegisterData) => {
    const data = await registerUserApi(userData);
    if (!data?.success) {
      return rejectWithValue(data);
    }
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  }
);

//авторизация пользователя
export const loginUser = createAsyncThunk(
  'auth/login',
  async (userData: TLoginData) => {
    const data = await loginUserApi(userData);
    if (!data?.success) {
      return rejectWithValue(data);
    }
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  }
);

//проверка, авторизован ли пользователь
export const checkUserAuth = createAsyncThunk(
  'auth/checkUser',
  async (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      getUserApi()
        .then((res) => dispatch(setUser(res.user)))
        .catch(() => {
          deleteCookie('accessToken');
          localStorage.removeItem('refreshToken');
        })
        .finally(() => {
          dispatch(authChecked(true));
        });
    } else {
      dispatch(authChecked(true));
    }
  }
);

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (user: TRegisterData) => {
    const res = await updateUserApi(user);
    return res.user;
  }
);

//выход из аккаунта
export const logoutUser = createAsyncThunk('auth/logout', (_, { dispatch }) => {
  logoutApi()
    .then(() => {
      localStorage.removeItem('refreshToken'); // очищаем refreshToken
      deleteCookie('accessToken'); // очищаем accessToken
      dispatch(logoutUser()); // удаляем пользователя из хранилища
    })
    .catch(() => {
      console.log('Ошибка выполнения выхода');
    });
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    },
    setUser: (state, action: PayloadAction<TUser>) => {
      state.user = action.payload;
    }
  },
  selectors: {
    userSelector: (state) => state.user,
    authSelector: (state) => state.isAuthChecked,
    errorSelector: (state) => state.errorMessage
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
        state.errorMessage = '';
      })
      .addCase(register.rejected, (state, action) => {
        state.errorMessage = action.error.message || '';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
        state.errorMessage = '';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.errorMessage = action.error.message || '';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.errorMessage = '';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  }
});

export const { authChecked, setUser } = authSlice.actions;

export const { userSelector, authSelector, errorSelector } =
  authSlice.selectors;

export const authReducer = authSlice.reducer;
function rejectWithValue(
  data: { success: boolean } & {
    refreshToken: string;
    accessToken: string;
    user: TUser;
  }
): any {
  throw new Error('Function not implemented.');
}
