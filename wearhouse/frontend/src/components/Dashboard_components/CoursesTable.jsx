import React from 'react';

const CoursesTable = ({isAdmin, filteredCourses, setEditCourse, setFormType, setIsFormOpen, handleDeleteTableData, setNotification, courseSearch, setCourseSearch, setEditStudent}) => {

  return (
    <>
      <h2 className='header2'>Course Management</h2>
          {/* Course Search Bar */}
          <input
            placeholder="Search courses..."
            value={courseSearch}
            onChange={e => setCourseSearch(e.target.value)}
            style={{ marginBottom: '1em', padding: '4px', width: '300px' }}
          />

          {/* Add Button */}
          <div className='addButtonContainer'>
            {isAdmin && (
              <button className='addButton' onClick={() => {
                setFormType('courses');
                setEditStudent(null);
                setIsFormOpen(true);
              }}>Add Course</button>
            )}
          </div>
        {/* Table Displaying All Courses */}
        <div className='tableContainer'>
          <table border="1" cellPadding="6">
            <thead>
              <tr>
                {/* <th>Course ID</th> */}
                <th>Course</th>
                <th>Number</th>
                <th>Room</th>
                <th>Building</th>
                <th>Start Time</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map(course => (
                <tr key={course.CourseID}>
                  {/* <td>{course.CourseID}</td> */}
                  <td>{course.CoursePrefix}</td>
                  <td>{course.CourseNumber}</td>
                  <td>{course.RoomNumber}</td>
                  <td>{course.Building}</td>
                  <td>{course.StartTime}</td>
                  {isAdmin && (
                    <td className='table_Actions_Container'>
                      <button onClick={() => {
                        setEditCourse(course);
                        setFormType('courses');
                        setIsFormOpen(true);
                      }}>Edit</button>
                      <button onClick={() => {
                        handleDeleteTableData(course.CourseID, 'courses');
                        setNotification({ show: true, message: 'Course deleted successfully', type: 'success' });
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

export default CoursesTable;