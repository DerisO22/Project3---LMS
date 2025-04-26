import React from 'react'

const StudentsTable = ({isAdmin, filteredStudents, setEditStudent, setFormType, setIsFormOpen, handleDeleteTableData, setNotification, studentSearch, setStudentSearch}) => {
  return (
    <>
        <h2 className='header2'>Student Management</h2>

        {/* Student Search Bar */}
        <input
        placeholder="Search students..."
        value={studentSearch}
        onChange={e => setStudentSearch(e.target.value)}
        style={{ marginBottom: '1em', padding: '4px', width: '300px' }}
        />
        <div className='addButtonContainer'>
        {isAdmin && (
            <button className='addButton' onClick={() => {
            setFormType('students');
            setEditStudent(null);
            setIsFormOpen(true);
            }}>Add Student</button>
        )}
        </div>

        {/* Student Table */}
        <div className='tableContainer'>
        <table className='studentTable' border="1" cellPadding="6">
            <thead>
            <tr>
                {/* <th>StudentID</th> */}
                <th>FirstName</th>
                <th>LastName</th>
                <th>Email</th>
                <th>Major</th>
                <th>GraduationYear</th>
                {isAdmin && <th>Actions</th>}
            </tr>
            </thead>
            <tbody>
            {filteredStudents.map(student => (
                <tr key={student.StudentID}>
                {/* <td>{student.StudentID}</td> */}
                <td>{student.FirstName}</td>
                <td>{student.LastName}</td>
                <td>{student.Email}</td>
                <td>{student.Major}</td>
                <td>{student.GraduationYear}</td>
                {isAdmin && (
                    <td className='table_Actions_Container'>
                    <button onClick={() => {
                        setEditStudent(student);
                        setFormType('students');
                        setIsFormOpen(true);
                    }}>Edit</button>
                    <button onClick={() => {
                        handleDeleteTableData(student.StudentID, 'students');
                        setNotification({ show: true, message: 'Student deleted successfully', type: 'success' });
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

export default StudentsTable;
