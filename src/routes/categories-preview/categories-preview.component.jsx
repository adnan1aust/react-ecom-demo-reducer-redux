import { /*useContext,*/ Fragment } from 'react';

//import { CategoriesContext } from '../../contexts/categories.context';
import CategoryPreview from '../../components/category-preview/category-preview.component';
import { selectCategoriesMap } from '../../store/categories/category.selector';
import { useSelector } from 'react-redux';

const CategoriesPreview = () => {
  const categoriesMap = useSelector(selectCategoriesMap);
  
  if(categoriesMap != null){
    return (
      <Fragment>
        {Object.keys(categoriesMap).map((title) => {
          const products = categoriesMap[title];
          return (
            <CategoryPreview key={title} title={title} products={products} />
          );
        })}
      </Fragment>
    );
  } else {
    return (
      <Fragment>
        <h1>Awaiting for fetching data</h1>
      </Fragment>
    );
  }
};

export default CategoriesPreview;
