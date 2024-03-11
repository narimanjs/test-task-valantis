import React, { useState, useEffect } from 'react';
import ProductsFilter from '../ProductsFilter/ProductsFilter';
import { getIds, getItems, filterItems } from '../../utils/api';
import styles from './ProductsPage.module.css';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const itemsPerPage = 50;

  useEffect(() => {
    fetchInitialProducts();
  }, [currentPage]);

  const fetchInitialProducts = async () => {
    setIsLoading(true);
    try {
      const idsResponse = await getIds({
        offset: (currentPage - 1) * itemsPerPage,
        limit: itemsPerPage,
      });

      if (Array.isArray(idsResponse)) {
        const itemsResponse = await getItems({ ids: idsResponse });
        setProducts(itemsResponse);
      } else {
        console.error('Ответ от getIds не является массивом:', idsResponse);
      }
    } catch (error) {
      console.error('Ошибка при загрузке товаров:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilter = async filters => {
    console.log('Фильтры перед отправкой:', filters); // Для проверки передаваемых фильтров, не могу пока настроить фильтр

    setIsLoading(true);
    try {
      const response = await filterItems(filters);
      console.log('Ответ от API:', response); // Для проверки ответа от API

      if (Array.isArray(response) && response.length > 0) {
        const itemsResponse = await getItems({ ids: response });
        setProducts(itemsResponse);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Ошибка при фильтрации товаров:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.ProductsPage}>
      <h1>Список товаров</h1>
      <ProductsFilter onFilter={handleFilter} />
      {isLoading ? (
        <div className={styles.Spinner}>
          <div className={styles.Loader}></div>
        </div>
      ) : (
        <ul className={styles.ProductList}>
          {products &&
            products.map((product, index) => (
              <li
                className={styles.ProductItem}
                key={`${product.id}-${index}`}
              >
                <h2>{product.product}</h2>
                <p>ID: {product.id}</p>
                <p>Цена: {product.price}</p>
                <p>Бренд: {product.brand || 'Не указан'}</p>
              </li>
            ))}
        </ul>
      )}
      <div className={styles.Pagination}>
        {currentPage > 1 && (
          <button onClick={() => setCurrentPage(currentPage - 1)}>
            Предыдущая
          </button>
        )}
        <button onClick={() => setCurrentPage(currentPage + 1)}>
          Следующая
        </button>
      </div>
    </div>
  );
};

export default ProductsPage;
