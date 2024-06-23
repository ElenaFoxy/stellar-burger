import { expect, test, describe } from '@jest/globals';
import { userSelector, authSelector, errorSelector } from './authSlice';
import store from '../store';

//моковые ингредиенты
const mockUserData = {
  email: 'foxy@mail.ru',
  name: 'Foxy Happy'
};

describe('Тестируем слайс authSlice', () => {
  test('Тестируем асинхронный экшен регистрации - fulfilled', () => {
    store.dispatch({ type: 'auth/register/fulfilled', payload: mockUserData });
    expect(userSelector(store.getState())).toEqual(mockUserData);
    expect(authSelector(store.getState())).toEqual(true);
    expect(errorSelector(store.getState())).toEqual('');
  });
  test('Тестируем асинхронный экшен регистрации - rejected', () => {
    store.dispatch({
      type: 'auth/register/rejected',
      error: { message: 'error auth' }
    });
    expect(errorSelector(store.getState())).toEqual('error auth');
  });
  test('Тестируем асинхронный экшен логина - fulfilled', () => {
    store.dispatch({ type: 'auth/login/fulfilled', payload: mockUserData });
    expect(userSelector(store.getState())).toEqual(mockUserData);
    expect(authSelector(store.getState())).toEqual(true);
    expect(errorSelector(store.getState())).toEqual('');
  });
  test('Тестируем асинхронный экшен логина - rejected', () => {
    store.dispatch({
      type: 'auth/login/rejected',
      error: { message: 'error login' }
    });
    expect(errorSelector(store.getState())).toEqual('error login');
  });
  test('Тестируем асинхронный экшен логаут - fulfilled', () => {
    store.dispatch({ type: 'auth/logout/fulfilled', error: { message: '' } });
    expect(userSelector(store.getState())).toEqual(null);
    expect(errorSelector(store.getState())).toEqual('');
  });
  test('Тестируем асинхронный экшен изменения данных  - fulfilled', () => {
    store.dispatch({
      type: 'auth/updateUser/fulfilled',
      payload: mockUserData
    });
    expect(userSelector(store.getState())).toEqual(mockUserData);
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});
