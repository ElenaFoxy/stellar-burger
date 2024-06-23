import { expect, test, describe } from '@jest/globals';
import { rootReducer } from './store';
import { initialState as authInitialState } from './auth/authSlice';
import { initialState as ingredientsInitialState } from './ingredients/ingredientsSlice';
import { initialState as constructorInitialState } from './constructor/constructorSlice';
import { initialState as feedInitialState } from './feed/feedSlice';
import { initialState as ordersInitialState } from './orders/ordersSlice';


//моковые данные для провоерки rootReducer
const mockInitialState = {
    auth: authInitialState,
    ingredients: ingredientsInitialState,
    burger: constructorInitialState,
    feed: feedInitialState,
    orders: ordersInitialState
};

//определение неизвестного действия
const unknownAction = { type: 'UNKNOWN_ACTION' };

//Тестируем правильную инициализацию rootReducer
describe('Тестируем правильную инициализацию rootReducer', () => {
    test('Вызов rootReducer ', () => {
        //вызов rootReducer с undefined состоянием и unknownAction
        const state = rootReducer(undefined, unknownAction);
        expect(state).toEqual(mockInitialState);
    });
})

