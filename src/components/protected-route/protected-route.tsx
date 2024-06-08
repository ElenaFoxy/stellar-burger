import { FC } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import React from 'react';
import { Preloader } from '../ui/preloader';
import { useSelector } from '../../services/store';
import { authSelector, userSelector } from '../../services/auth/authSlice';

type TProtectedRouteProps = {
  isAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({ isAuth, children }: TProtectedRouteProps) => {
  const isAuthChecked = useSelector(authSelector); //  — селектор получения состояния загрузки пользователя
  const user = useSelector(userSelector); //  — селектор получения пользователя из store
  const location = useLocation();

  if (!isAuthChecked) {
    // пока идёт чекаут пользователя, показываем прелоадер
    return <Preloader />;
  }

  if (!isAuth && !user) {
    // если пользователь на странице авторизации или данных в хранилище нет, то делаем редирект
    return <Navigate to='/login' state={{ from: location }} />; // в поле from объекта location.state записываем информацию о URL
  }

  if (isAuth && user) {
    // если пользователь на странице авторизации и данные есть в хранилище
    const { from } = location.state || { from: { pathname: '/' } };

    return <Navigate to={from} />;
  }

  return children;
};
