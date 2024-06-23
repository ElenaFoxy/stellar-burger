import { expect, test, describe } from '@jest/globals';
import {
  initialState as constructorInitialState,
  constructorReducer,
  addIngredients,
  deleteIngredients,
  moveIngredientsDown,
  moveIngredientsUp
} from './constructorSlice';

//моковые ингредиенты
const mockIngredients = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    __v: 0
  },
  {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
    __v: 0
  },
  {
    _id: '643d69a5c3f7b9001cfa093e',
    name: 'Филе Люминесцентного тетраодонтимформа',
    type: 'main',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://code.s3.yandex.net/react/code/meat-03.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
    __v: 0
  },
  {
    _id: '643d69a5c3f7b9001cfa0942',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
    __v: 0
  }
];

const mockConstructorItems = {
  bun: {
    ...mockIngredients[0],
    id: 'bunTest'
  },
  ingredients: [
    {
      ...mockIngredients[1],
      id: 'mainTest'
    }
  ]
};

const moveInitialState = {
  constructorItems: {
    ...mockConstructorItems,
    ingredients: [
      { ...mockIngredients[0], id: 'bunTest' },
      { ...mockIngredients[1], id: 'mainTest' }
    ]
  },
  orderRequest: false,
  orderModalData: null
};

describe('Тестируем слайс constructor', () => {
  test('Тестируем обработку экшена добавления ингредиента - булки', () => {
    const addIngredient = {
      type: addIngredients.type,
      payload: { ...mockIngredients[0], id: 'bunTest' }
    };
    const { constructorItems } = constructorReducer(
      constructorInitialState,
      addIngredient
    );

    expect(constructorItems.bun).toEqual(mockConstructorItems.bun);
  });

  test('Тестируем обработку экшена добавления ингредиента - начинки', () => {
    const addIngredient = {
      type: addIngredients.type,
      payload: { ...mockIngredients[1], id: 'mainTest' }
    };
    const { constructorItems } = constructorReducer(
      constructorInitialState,
      addIngredient
    );

    expect(constructorItems.ingredients).toEqual(
      mockConstructorItems.ingredients
    );
  });

  test('Тестируем обработку экшена удаления ингредиента', () => {
    const deleteIngredient = {
      type: deleteIngredients.type,
      payload: { ...mockIngredients[1], id: 'mainTest' }
    };
    const { constructorItems } = constructorReducer(
      constructorInitialState,
      deleteIngredient
    );

    expect(constructorItems.ingredients).toEqual([]);
  });

  test('Тестируем обработку экшена перемещения ингредиента вниз', () => {
    const { constructorItems } = constructorReducer(
      moveInitialState,
      moveIngredientsDown(0)
    );

    expect(constructorItems.ingredients).toEqual([
      { ...mockIngredients[1], id: 'mainTest' },
      { ...mockIngredients[0], id: 'bunTest' }
    ]);
  });

  test('Тестируем обработку экшена перемещения ингредиента вверх', () => {
    const { constructorItems } = constructorReducer(
      moveInitialState,
      moveIngredientsUp(1)
    );

    expect(constructorItems.ingredients).toEqual([
      { ...mockIngredients[1], id: 'mainTest' },
      { ...mockIngredients[0], id: 'bunTest' }
    ]);
  });
});
