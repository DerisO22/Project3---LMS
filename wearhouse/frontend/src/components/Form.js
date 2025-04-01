import { useState } from 'react';

export default function Form({ type, onSubmit, initialData = {}, categories = [] }) {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {type === 'category' ? (
        <>
          <input
            name="category_name"
            placeholder="Category Name"
            value={formData.category_name || ''}
            onChange={handleChange}
            required
          />
        </>
      ) : (
        <>
          <input
            name="product_name"
            placeholder="Product Name"
            value={formData.product_name || ''}
            onChange={handleChange}
            required
          />
          <input
            name="price"
            type="number"
            step="0.01"
            placeholder="Price"
            value={formData.price || ''}
            onChange={handleChange}
            required
          />
          <select
            name="category_id"
            value={formData.category_id || ''}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat.category_id} value={cat.category_id}>
                {cat.category_name}
              </option>
            ))}
          </select>
        </>
      )}
      <button type="submit">{initialData?.category_id || initialData?.product_id ? 'Update' : 'Add'}</button>
    </form>
  );
}
