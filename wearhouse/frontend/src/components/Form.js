
import React, { useState, useEffect } from 'react';
import './Form.css';

export default function Form({ type, isOpen, onClose, onSubmit, initialData = {} }) {
  const [formData, setFormData] = useState(initialData || {});

  useEffect(() => {
    setFormData(initialData || {});
  }, [initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal_overlay">
      <div className="modal_content">
        <form onSubmit={handleSubmit}>
          <div className="form_header">
            <h2>{type === 'courses' ? 'Course Form' : type === 'students' ? 'Student Form' : 'Student Course Form'}</h2>
            <button type="button" className="close_button" onClick={onClose}>×</button>
          </div>

          {type === 'courses' && (
            <div className="form_fields">
              <input
                name="CoursePrefix"
                placeholder="Course Prefix"
                value={formData.CoursePrefix || ''}
                onChange={handleChange}
                required
              />
              <input
                name="CourseNumber"
                placeholder="Course Number"
                type="number"
                value={formData.CourseNumber || ''}
                onChange={handleChange}
                required
              />
              <input
                name="RoomNumber"
                placeholder="Room Number"
                type="number"
                value={formData.RoomNumber || ''}
                onChange={handleChange}
                required
              />
              <input
                name="Building"
                placeholder="Building"
                value={formData.Building || ''}
                onChange={handleChange}
                required
              />

              {/* Quality of Life stuff
                  Typing out the times is annoying
              */} 
              <select
                className='drop_down_time'
                name="StartTime"
                value={formData.StartTime || ''}
                onChange={handleChange}
                required
              >
                <option value="">Select Starting Time</option>
                <option value='8:30:00' > 8:30 AM</option>
                <option value='10:00:00'>10:00 AM</option>
                <option value='11:30:00'>11:30 AM</option>
                <option value='13:00:00'> 1:00 PM</option>
                <option value='14:30:00'> 2:30 PM</option>
                <option value='16:00:00'> 4:00 PM</option>
                <option value='17:30:00'> 5:30 PM</option>
                <option value='19:00:00'> 7:00 PM</option>
              </select>
            </div>
          )}

          {type === 'students' && (
            <div className="form_fields">
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
                type="email"
                value={formData.Email || ''}
                onChange={handleChange}
                required
              />
              <input
                name="MajorID"
                placeholder="Major ID"
                type="number"
                value={formData.MajorID || ''}
                onChange={handleChange}
                required
              />
              <select
                name="GraduationYear"
                value={formData.GraduationYear || ''}
                onChange={handleChange}
                required
              >
                <option value="">Select Graduation Year</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
              </select>
            </div>
          )}

          {type === 'student_courses' && (
            <div className="form_fields">
              <input
                name="StudentID"
                placeholder="Student ID"
                type="number"
                value={formData.StudentID || ''}
                onChange={handleChange}
                required
              />
              <input
                name="CourseID"
                placeholder="Course ID"
                type="number"
                value={formData.CourseID || ''}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="form_actions">
            <button className='formButton' type="submit">Save Changes</button>
            <button className='formButton' type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
