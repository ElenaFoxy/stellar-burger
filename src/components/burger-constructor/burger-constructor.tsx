import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  constructorSelector,
  orderModalDataSelector,
  orderRequestSelector,
  clearConstructor,
  setOrderModalData,
  setOrderRequest,
  postOrderBurger
} from '../../services/constructor/constructorSlice';
import { userSelector } from '../../services/auth/authSlice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const constructorItems = useSelector(constructorSelector);

  const orderRequest = useSelector(orderRequestSelector);

  const orderModalData = useSelector(orderModalDataSelector);

  const user = useSelector(userSelector);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return null;
    if (user) {
      const ingredients =
        constructorItems.ingredients?.map((item) => item._id) || [];
      ingredients.unshift(constructorItems.bun._id);
      ingredients.push(constructorItems.bun._id);
      dispatch(postOrderBurger(ingredients));
    } else {
      navigate('/login');
    }
  };
  const closeOrderModal = () => {
    dispatch(setOrderRequest(false));
    dispatch(setOrderModalData(null));
    dispatch(clearConstructor());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  // return null;

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
