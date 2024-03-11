import React, { useState } from 'react';
import styles from './ProductsFilter.module.css';

const ProductsFilter = ({ onFilter }) => {
  const [filterParams, setFilterParams] = useState({});

  const handleChange = e => {
    const { name, value } = e.target;
    if (value === '' || value === null) {
      delete filterParams[name];
    } else {
      setFilterParams(prev => ({
        ...prev,
        [name]: name === 'price' && value ? parseFloat(value) : value,
      }));
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    onFilter(filterParams);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.filterForm}
    >
      <div className={styles.filterGroup}>
        <label htmlFor='product'>Название:</label>
        <input
          id='product'
          name='product'
          type='text'
          value={filterParams.product}
          onChange={handleChange}
        />
      </div>
      <div className={styles.filterGroup}>
        <label htmlFor='price'>Цена:</label>
        <input
          id='price'
          name='price'
          type='number'
          value={filterParams.price}
          onChange={handleChange}
        />
      </div>
      <div className={styles.filterGroup}>
        <label htmlFor='brand'>Бренд:</label>
        <input
          id='brand'
          name='brand'
          type='text'
          value={filterParams.brand}
          onChange={handleChange}
        />
      </div>
      <button
        type='submit'
        className={styles.filterButton}
      >
        Фильтровать
      </button>
    </form>
  );
};

export default ProductsFilter;
