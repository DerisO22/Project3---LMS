
import React, { useState, useEffect } from 'react';
import './Form.css';

export default function Form({ type, isOpen, onClose, onSubmit, initialData = {}, studentData, courseData }) {
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

  console.log(formData)

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
              <div className='text'>Course Prefix</div>
              <input
                name="CoursePrefix"
                placeholder="Course Prefix"
                value={formData.CoursePrefix || ''}
                onChange={handleChange}
                required
              />
              <div className='text'>Course Section</div>
              <input
                name="CourseNumber"
                placeholder="Course Section"
                type="number"
                value={formData.CourseNumber || ''}
                onChange={handleChange}
                required
              />
              <div className='text'>RoomNumber</div>
              <input
                name="RoomNumber"
                placeholder="Room Number"
                type="number"
                value={formData.RoomNumber || ''}
                onChange={handleChange}
                required
              />
              <div className='text'>Building</div>
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
              <div className='text'>Starting Time</div>
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
              <div className='text'>First Name</div>
              <input
                name="FirstName"
                placeholder="First Name"
                value={formData.FirstName || ''}
                onChange={handleChange}
                required
              />
              <div className='text'>Last Name</div>
              <input
                name="LastName"
                placeholder="Last Name"
                value={formData.LastName || ''}
                onChange={handleChange}
                required
              />
              <div className='text'>Email</div>
              <input
                name="Email"
                placeholder="Email"
                type="email"
                value={formData.Email || ''}
                onChange={handleChange}
                required
              />
              <div className='text'>Major</div>
              <select
                name="MajorID"
                value={formData.MajorID || ''}
                defaultValue="Select a major"
                onChange={handleChange}
                required
              >
                <option value="">Select A Major</option>
                <option value={1}>Data Science</option>
                <option value={2}>Computer Science</option>
              </select>

              <div className='text'>Graduation Year</div>
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
              <div className="form_fields">
              <div className='text'>Student</div>
              <select
                name="StudentID"
                value={formData.StudentID || ''}
                onChange={handleChange}
                required
              >
                <option value="">Select Student</option>
                {studentData && studentData.map(student => (
                  <option key={student.StudentID} value={student.StudentID}>
                    {student.FirstName} {student.LastName}
                  </option>
                ))}
              </select>
              <div className='text'>Course</div>
              <select
                name="CourseID"
                value={formData.CourseID || ''}
                onChange={handleChange}
                required
              >
                <option value="">Select Course</option>
                {courseData && courseData.map(course => (
                  <option key={course.CourseID} value={course.CourseID}>
                    {course.CoursePrefix}-{course.CourseNumber}
                  </option>
                ))}
              </select>
              </div>
            </div> )}
            {type === 'grades' && formData && (
              <div className="form_fields">
                <div className='text'>Student</div>
                <input
                  name="StudentID"
                  placeholder="Student ID"
                  type="number"
                  value={formData.StudentID || ''}
                  onChange={handleChange}
                  required
                />
                <div className='text'>Course</div>
                <input
                  name="CourseID"
                  placeholder="Course ID"
                  type="number"
                  value={formData.CourseID || ''}
                  onChange={handleChange}
                  required
                />
                <div className='text'>Quiz 1 Grade</div>
                <input
                  name="quiz1Grade"
                  placeholder="Quiz 1 Grade"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.quiz1Grade || ''}
                  onChange={handleChange}
                  required
                />
                <div className='text'>Quiz 2 Grade</div>
                <input
                  name="quiz2Grade"
                  placeholder="Quiz 2 Grade"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.quiz2Grade || ''}
                  onChange={handleChange}
                  required
                />
                <div className='text'>Project 1 Grade</div>
                <input
                  name="project1Grade"
                  placeholder="Project 1 Grade"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.project1Grade || ''}
                  onChange={handleChange}
                  required
                />
                <div className='text'>Project 2 Grade</div>
                <input
                  name="project2Grade"
                  placeholder="Project 2 Grade"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.project2Grade || ''}
                  onChange={handleChange}
                  required
                />
                <div className='text'>Final Exam Grade</div>
                <input
                  name="finalExamGrade"
                  placeholder="Final Exam Grade"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.finalExamGrade || ''}
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
