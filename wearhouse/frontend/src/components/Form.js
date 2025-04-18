import { useState } from 'react';
import './Form.css';

export default function Form({ type, onSubmit, initialData = {}, courses = [] }) {
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
    // Need this to be usable for Courses
    <form onSubmit={handleSubmit}>
      {type === 'courses' (
        <>
          {/* Course Input Fields */}
          <input
            name="Prefix"
            placeholder="Course Prefix"
            value={formData.Prefix || ''}
            onChange={handleChange}
            required
          />
          <input
            name="Number"
            placeholder="Course Number"
            value={formData.Number || ''}
            onChange={handleChange}
            required
          />
          <input
            name="LocationID"
            placeholder="Location ID"
            value={formData.LocationID || ''}
            onChange={handleChange}
            required
          />
          <input
            name="StartTime"
            placeholder="Start Time"
            value={formData.StartTime || ''}
            onChange={handleChange}
            required
          />
        </>
      ) || type ==="students" (
        <>
          {/* Student Input Fields */}
          <input
            name="FirstName"
            placeholder="First Name"
            value={formData.FirstName || ''}
            onChange={handleChange}
            required
          />
          <input
            name="LastName"
            placeholder="Last Name"
            value={formData.LastName || ''}
            onChange={handleChange}
            required
          />
          <input
            name="Email"
            placeholder="Email"
            value={formData.Email || ''}
            onChange={handleChange}
            required
          />
          <input
            name="MajorID"
            placeholder="MajorID"
            value={formData.MajorID || ''}
            onChange={handleChange}
            required
          />
          <select
            className='GraduationYear'
            name="GraduationYear"
            value={formData.GraduationYear || ''}
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
      ) || type === 'studentCourses' (

      )}
      <button type="submit">{initialData?.category_id || initialData?.product_id ? 'Update' : 'Add'}</button>
    </form>
  );
}
