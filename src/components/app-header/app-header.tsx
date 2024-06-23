import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { userSelector } from '../../services/auth/authSlice';

export const AppHeader: FC = () => {
  const user = useSelector(userSelector);
  return <AppHeaderUI userName={user?.name} />;
};
