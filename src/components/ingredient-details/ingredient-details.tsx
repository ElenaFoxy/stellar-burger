import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useDispatch, useSelector } from '../../services/store';
import { ingredientsSelector } from '../../services/ingredients/ingredientsSlice';
import { useParams } from 'react-router-dom';

export const IngredientDetails: FC = () => {
  const ingredients = useSelector(ingredientsSelector);
  const params = useParams();
  /** TODO: взять переменную из стора */
  const ingredientData = ingredients?.find((item) => item._id === params.id); //null;

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
