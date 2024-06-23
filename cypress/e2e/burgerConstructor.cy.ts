import { data } from '../fixtures/ingredients.json';
import { accessToken, refreshToken } from '../fixtures/authUser.json';

beforeEach(() => {
  //перехватить GET-запрос к URL '/api/ingredients'
  // имитировать ответ с моковыми данными ingredients.json
  cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
  cy.visit('http://localhost:4000');
  // имитировать ответ с моковыми данными authUser.json
  cy.intercept('GET', `api/auth/user`, { fixture: 'authUser.json' });
  //Установить куки
  cy.setCookie('accessToken', accessToken);
  //сохранить токен обновления в локальном хранилище
  window.localStorage.setItem('refreshToken', refreshToken);
  //загружаем данные из файла 'ingredients.json' как ingredients
  cy.fixture('ingredients.json').as('ingredients');
  //берем моковый заказ
  cy.fixture('order.json').as('orderInfo');
  //найти конструктор, в котором будем искать булку
  cy.get("[data-cy='burger-constructor']").as('constructor');
});

describe('Тестируем добавление ингредиента из списка в конструктор', () => {
  it('Тестируем добавление булок', () => {
    //берем моковую булку (это первый элемент данных)
    cy.get('@ingredients').then((ingredients) => {
      cy.get(`[data-ingredient-cy=${ingredients.data[0]._id}]`).as('bun');
    });

    //найти кнопку добавления ингредиента
    const addButton = cy.get('@bun').contains('button', 'Добавить');
    //нажать на кнопку
    addButton.click();
    //убедиться, что конструктор содержит булку
    cy.get('@constructor').contains('Краторная булка N-200i');
  });

  it('Тестируем добавление ингредиента (не булки)', () => {
    //берем моковую котлету (это второй элемент данных)
    cy.get('@ingredients').then((ingredients) => {
      cy.get(`[data-ingredient-cy=${ingredients.data[1]._id}]`).as('main');
    });

    //найти кнопку добавления ингредиента
    const addButton = cy.get('@main').contains('button', 'Добавить');
    //нажать на кнопку
    addButton.click();
    //убедиться, что конструктор содержит котлету
    cy.get('@constructor').contains('Биокотлета из марсианской Магнолии');
  });
});

describe('Тестируем работу модальных окон', () => {
  it('Oткрытие и закрытие модального окна ингредиента', () => {
    cy.get('@ingredients').then((ingredients) => {
      cy.get(`[data-ingredient-cy=${ingredients.data[0]._id}]`).as('bun');
    });
    cy.get('@bun').click();
    //найти модальное окно
    cy.get("[data-cy='modal']").as('modal');
    //модальное окно открыто
    cy.get('@modal').should('be.visible');
    //в модальном окне отображается элемент, на который нажали
    cy.url().should('contain', `${data[0]._id}`);
    //кнопка закрытия
    const closeButton = cy.get('@modal').find('button');
    //нажимаем кнопку
    closeButton.click();
    //окно закрыто
    cy.url().should('not.contain', `${data[0]._id}`);
    cy.get('@modal').should('not.exist');
  });

  it('Закрытие по клику на оверлей', () => {
    cy.get('@ingredients').then((ingredients) => {
      cy.get(`[data-ingredient-cy=${ingredients.data[0]._id}]`).as('bun');
    });
    cy.get('@bun').click();
    //найти модальное окно
    cy.get("[data-cy='modal']").as('modal');
    //модальное окно открыто
    cy.get('@modal').should('be.visible');
    //в модальном окне отображается элемент, на который нажали
    cy.url().should('contain', `${data[0]._id}`);
    //нажимаем на оверлей
    cy.get("[data-cy='modal-overlay']").click(-50, -50, { force: true });
    //окно закрыто
    cy.get('@modal').should('not.exist');
    cy.url().should('not.contain', `${data[0]._id}`);
  });
});

describe('Тестируем cоздание заказа', () => {
  it('Тестируем Создание заказа с авторизацией пользователя', () => {
    cy.visit('http://localhost:4000');
    //проверить, есть ли свойство «value» у cookie с именем «accessToken»
    cy.getCookie('accessToken').should('have.property', 'value', accessToken);

    cy.get('@orderInfo').then((orderInfo) => {
      cy.intercept('POST', 'api/orders', orderInfo);
      //найти каждый ингредиент заказа и добавить в заказ
      for (let i = 0; i < orderInfo.order.ingredients.length; i++) {
        cy.get(`[data-ingredient-cy=${orderInfo.order.ingredients[i]._id}]`).as(
          'bun'
        );
        //найти кнопку добавления ингредиента
        const addButton = cy.get('@bun').contains('button', 'Добавить');
        //нажать на кнопку
        addButton.click();
      }
      //проверить сумму с суммой заказа
      cy.get(`[data-cy='price']`).contains(orderInfo.order.price);
    });
    //найти кнопку Оформить заказ
    const orderButton = cy.get(`[data-cy='order']`);
    orderButton.click();

    //найти модальное окно
    cy.get("[data-cy='modal']").as('modal');
    cy.get('@modal').contains('Оформляем заказ...');

    //закрыть модальное коно
    const closeButton = cy.get('@modal').find('button').last();
    closeButton.click();
    //проверить, что окно закрыто
    cy.get('@modal').should('not.exist');
    //конструктор пустой
    cy.get('@constructor').contains(0);
  });
  it('Тестируем Создание заказа без авторизации пользователя', () => {
    cy.get('@orderInfo').then((orderInfo) => {
      cy.intercept('POST', 'api/orders', orderInfo);
      //найти каждый ингредиент заказа и добавить в заказ
      for (let i = 0; i < orderInfo.order.ingredients.length; i++) {
        cy.get(`[data-ingredient-cy=${orderInfo.order.ingredients[i]._id}]`).as(
          'bun'
        );
        //найти кнопку добавления ингредиента
        const addButton = cy.get('@bun').contains('button', 'Добавить');
        //нажать на кнопку
        addButton.click();
      }
      //проверить сумму с суммой заказа
      cy.get(`[data-cy='price']`).contains(orderInfo.order.price);
    });
    //найти кнопку Оформить заказ
    const orderButton = cy.get(`[data-cy='order']`);
    orderButton.click();
    //так как пользователь не авторизован просим войти
    cy.location().should((location) => {
      expect(location.pathname).to.eq('/login');
    });
  });
});

describe('проверяем доступность приложения', function () {
  it('сервис должен быть доступен по адресу localhost:4000', function () {
    cy.visit('http://localhost:4000');
  });
});

afterEach(() => {
  cy.clearCookie('accessToken');
  window.localStorage.removeItem('refreshToken');
});
