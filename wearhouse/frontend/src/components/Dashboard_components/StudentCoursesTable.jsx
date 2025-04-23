
import React from 'react'

const StudentCoursesTable = ({
  isAdmin, 
  filteredStudentCourses, 
  setEditStudentCourses, 
  setFormType, 
  setIsFormOpen, 
  handleDeleteTableData, 
  setNotification,
  studentCoursesSearch,
  setStudentCoursesSearch
}) => {
  return (
    <>
      <h2 className='header2'>Student's Courses Management</h2>
      <div className='studentCoursesTableContainer'>
        <input
          placeholder="Search students and their courses..."
          value={studentCoursesSearch}
          onChange={e => setStudentCoursesSearch(e.target.value)}
          style={{ marginBottom: '1em', padding: '4px', width: '300px' }}
        />

        <div className='addButtonContainer' style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
          {isAdmin && (
            <button className='addButton' onClick={() => {
              setFormType('student_courses');
              setEditStudentCourses(null);
              setIsFormOpen(true);
            }}>Add Student Course</button>
          )}
        </div>

        <table className='studentCoursesTable' border="1" cellPadding="6">
          <thead>
            <tr>
              <th>StudentID</th>
              <th>CourseID</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredStudentCourses.map(sc => (
              <tr key={`${sc.StudentID}-${sc.CourseID}`}>
                <td>{sc.StudentID}</td>
                <td>{sc.CourseID}</td>
                {isAdmin && (
                  <td className='table_Actions_Container'>
                    <button onClick={() => {
                      setEditStudentCourses(sc);
                      setFormType('student_courses');
                      setIsFormOpen(true);
                    }}>Edit</button>
                    <button onClick={() => {
                      handleDeleteTableData(sc.CourseID, 'student_courses', sc.StudentID);
                      setNotification({ show: true, message: 'Student Course deleted successfully', type: 'success' });
                    }}>Delete</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default StudentCoursesTable;
