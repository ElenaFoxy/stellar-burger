import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import {
  Router,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams
} from 'react-router-dom';
import {
  AppHeader,
  ProtectedRoute,
  Modal,
  OrderInfo,
  IngredientDetails
} from '@components';
import { getIngredients } from '../../services/ingredients/ingredientsSlice';
import { checkUserAuth } from '../../services/auth/authSlice';
import { useDispatch, useSelector } from '../../services/store';
import { useEffect } from 'react';
import { orderSelector } from '../../services/feed/feedSlice';

const App = () => {
  const location = useLocation();
  const background = location.state?.background;
  const navigate = useNavigate();
  const dispath = useDispatch();
  const orderData = useSelector(orderSelector);
  const title = orderData?.number;
  useEffect(() => {
    dispath(getIngredients());
    dispath(checkUserAuth());
  }, []);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/login'
          element={<ProtectedRoute isAuth children={<Login />} />}
        />
        <Route
          path='/register'
          element={<ProtectedRoute isAuth children={<Register />} />}
        />
        <Route
          path='/forgot-password'
          element={<ProtectedRoute isAuth children={<ForgotPassword />} />}
        />
        <Route
          path='/reset-password'
          element={<ProtectedRoute isAuth children={<ResetPassword />} />}
        />
        <Route
          path='/profile'
          element={<ProtectedRoute children={<Profile />} />}
        />
        <Route
          path='/profile/orders'
          element={<ProtectedRoute children={<ProfileOrders />} />}
        />
        <Route path='*' element={<NotFound404 />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route
          path='/feed/:number'
          element={<ProtectedRoute children={<OrderInfo />} />}
        />
        <Route
          path='/profile/orders/:number'
          element={<ProtectedRoute children={<OrderInfo />} />}
          // element={<OrderInfo />}
        />
      </Routes>

      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal
                title={'#' + title}
                onClose={() => {
                  navigate(-1);
                }}
              >
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal
                title='Детали ингредиента'
                onClose={() => {
                  navigate(-1);
                }}
              >
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal
                title={'#' + title}
                onClose={() => {
                  navigate(-1);
                }}
              >
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};
export default App;
