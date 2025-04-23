import React from 'react';

const GradeTable = ({
    isAdmin,
    filteredGrades,
    setEditStudentGrades,
    setFormType,
    setIsFormOpen,
    handleDeleteTableData,
    setNotification,
    studentGradeSearch,
    setStudentGradeSearch
}) => {
  return (
    <>
        {/* Grades Table */}
        <h2 className='header2'>Student Grades Management</h2>

        {/* Add Button */}
        <div className='addButtonContainer'>
          {isAdmin && (
            <button className='addButton' onClick={() => {
              setFormType('grades');
              setEditStudentGrades(null);
              setIsFormOpen(true);
            }}>Add Student's Grades</button>
          )}
        </div>

        {/* Grades Search Bar */}
        <input
          placeholder="Search Grades by Name..."
          value={studentGradeSearch}
          onChange={e => setStudentGradeSearch(e.target.value)}
          style={{ marginBottom: '1em', padding: '6px', width: '15rem' }}
        />

        <div className='tableContainer'>
          <table className='studentTable' border="1" cellPadding="6">
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Quiz 1</th>
                <th>Quiz 2</th>
                <th>Project 1</th>
                <th>Project 2</th>
                <th>Final Exam</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredGrades.map(g => (
                  <tr key={`${g.StudentID}-${g.CourseID}`}>
                  <td>{g.FirstName} {g.LastName}</td>
                  <td>{g.CoursePrefix}-{g.CourseNumber}</td>
                  <td>{g.quiz1Grade || 'N/A'}</td>
                  <td>{g.quiz2Grade || 'N/A'}</td>
                  <td>{g.project1Grade || 'N/A'}</td>
                  <td>{g.project2Grade || 'N/A'}</td>
                  <td>{g.finalExamGrade || 'N/A'}</td>
                  {isAdmin && (
                    <td className='table_Actions_Container'>
                      <button onClick={() => {
                        setEditStudentGrades(g);
                        setFormType('grades');
                        setIsFormOpen(true);
                      }}>Edit</button>
                      <button onClick={() => {
                        handleDeleteTableData(g.GradeID, 'grades');
                        setNotification({ show: true, message: 'Grade record deleted successfully', type: 'success' });
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

export default GradeTable
