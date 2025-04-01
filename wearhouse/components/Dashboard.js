import { useEffect, useState } from 'react';
import Form from './Form';

export default function Dashboard({ isAdmin }) {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');

  const [editCategory, setEditCategory] = useState(null);
  const [editProduct, setEditProduct] = useState(null);

  const fetchData = () => {
    fetch('http://localhost:5000/categories')
      .then(res => res.json())
      .then(setCategories);
    fetch('http://localhost:5000/products')
      .then(res => res.json())
      .then(setProducts);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addOrUpdateCategory = async (data) => {
    const method = editCategory ? 'PUT' : 'POST';
    const url = editCategory
      ? `http://localhost:5000/categories/${editCategory.category_id}`
      : 'http://localhost:5000/categories';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setEditCategory(null);
    fetchData();
  };

  const addOrUpdateProduct = async (data) => {
    const method = editProduct ? 'PUT' : 'POST';
    const url = editProduct
      ? `http://localhost:5000/products/${editProduct.product_id}`
      : 'http://localhost:5000/products';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setEditProduct(null);
    fetchData();
  };

  const deleteCategory = async (id) => {
    await fetch(`http://localhost:5000/categories/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const deleteProduct = async (id) => {
    await fetch(`http://localhost:5000/products/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const getCategoryName = (category_id) => {
    const cat = categories.find(c => c.category_id === category_id);
    return cat ? cat.category_name : 'Unknown';
  };

  const filteredProducts = products.filter(p =>
    p.product_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2>Categories</h2>
      {isAdmin && (
        <Form
          type="category"
          onSubmit={addOrUpdateCategory}
          initialData={editCategory || {}}
        />
      )}
      <table border="1" cellPadding="6" style={{ marginBottom: '2em' }}>
        <thead>
          <tr>
            <th>Category ID</th>
            <th>Category Name</th>
            {isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {categories.map(cat => (
            <tr key={cat.category_id}>
              <td>{cat.category_id}</td>
              <td>{cat.category_name}</td>
              {isAdmin && (
                <td>
                  <button onClick={() => setEditCategory(cat)}>Edit</button>
                  <button onClick={() => deleteCategory(cat.category_id)}>Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <h2>All Products</h2>
      <input
        placeholder="Search product name..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: '1em', padding: '4px', width: '300px' }}
      />

      {isAdmin && (
        <Form
          type="product"
          onSubmit={addOrUpdateProduct}
          initialData={editProduct || {}}
          categories={categories}
        />
      )}

      <table border="1" cellPadding="6" style={{ width: '50%' }}>
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Category ID</th>
            {isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map(prod => (
            <tr key={prod.product_id}>
              <td>{prod.product_id}</td>
              <td>{prod.product_name}</td>
              <td>${prod.price}</td>
              <td>{prod.category_id}</td>
              {isAdmin && (
                <td>
                  <button onClick={() => setEditProduct(prod)}>Edit</button>
                  <button onClick={() => deleteProduct(prod.product_id)}>Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
