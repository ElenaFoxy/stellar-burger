import { expect, test, describe } from '@jest/globals';
import {
  orderSelector,
  ordersSelector,
  totalSelector,
  totalTodaySelector
} from './feedSlice';
import store from '../store';

const mockOrders = {
  success: true,
  orders: [
    {
      _id: '6677b7f0856777001bb1d0b4',
      ingredients: [
        '643d69a5c3f7b9001cfa093e',
        '643d69a5c3f7b9001cfa0942',
        '643d69a5c3f7b9001cfa0940',
        '643d69a5c3f7b9001cfa093d'
      ],
      status: 'done',
      name: 'Флюоресцентный spicy люминесцентный метеоритный бургер',
      createdAt: '2024-06-23T05:51:44.338Z',
      updatedAt: '2024-06-23T05:51:45.105Z',
      number: 43923
    },
    {
      _id: '6677a027856777001bb1d0a2',
      ingredients: [
        '643d69a5c3f7b9001cfa093c',
        '643d69a5c3f7b9001cfa0949',
        '643d69a5c3f7b9001cfa0942'
      ],
      status: 'done',
      name: 'Краторный экзо-плантаго spicy бургер',
      createdAt: '2024-06-23T04:10:15.481Z',
      updatedAt: '2024-06-23T04:10:15.910Z',
      number: 43922
    },
    {
      _id: '66779e63856777001bb1d0a0',
      ingredients: [
        '643d69a5c3f7b9001cfa093c',
        '643d69a5c3f7b9001cfa093f',
        '643d69a5c3f7b9001cfa0940'
      ],
      status: 'done',
      name: 'Краторный бессмертный метеоритный бургер',
      createdAt: '2024-06-23T04:02:43.307Z',
      updatedAt: '2024-06-23T04:02:43.726Z',
      number: 43921
    },
    {
      _id: '667745cb856777001bb1d061',
      ingredients: [
        '643d69a5c3f7b9001cfa093c',
        '643d69a5c3f7b9001cfa0943',
        '643d69a5c3f7b9001cfa0942'
      ],
      status: 'done',
      name: 'Краторный space spicy бургер',
      createdAt: '2024-06-22T21:44:43.965Z',
      updatedAt: '2024-06-22T21:44:44.505Z',
      number: 43920
    }
  ],
  total: 43549,
  totalToday: 131
};

describe('Тестируем слайс feedSlice', () => {
  test('Тестируем асинхронный экшен загрузки заказов - fulfilled', () => {
    store.dispatch({
      type: 'orders/all/fulfilled',
      payload: mockOrders
    });

    expect(ordersSelector(store.getState())).toEqual(mockOrders.orders);
    expect(totalSelector(store.getState())).toEqual(mockOrders.total);
    expect(totalTodaySelector(store.getState())).toEqual(mockOrders.totalToday);
  });
  test('Тестируем асинхронный экшен загрузки деталей заказа - fulfilled', () => {
    store.dispatch({
      type: 'orders/getOrderById/fulfilled',
      payload: mockOrders.orders
    });

    expect(orderSelector(store.getState())).toEqual(mockOrders.orders[0]);
  });
  test('Тестируем асинхронный экшен загрузки деталей заказа - rejected', () => {
    store.dispatch({
      type: 'orders/getOrderById/rejected'
    });

    expect(orderSelector(store.getState())).toEqual(null);
  });
});

afterEach(() => {
  jest.resetAllMocks();
});
