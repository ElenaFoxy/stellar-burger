import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { ordersSelector } from '../../services/feed/feedSlice';
import { getOrders } from '../../services/orders/ordersSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  /** TODO: взять переменную из стора */
  const orders: TOrder[] = useSelector(ordersSelector);
  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);
  return <ProfileOrdersUI orders={orders} />;
};
