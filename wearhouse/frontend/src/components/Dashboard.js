import { useEffect, useState } from 'react';
import '../App.css';
import CardContainer from './CardContainer';
import Form from './Form'; // Assuming Form component exists
import Notification from './Notification'; // Assuming Notification component exists

const TOTAL_TABLE_FETCHES = 3;
const TABLES = ['courses', 'students', 'student_courses'];

export default function Dashboard({ isAdmin }) {
    // Table Data States
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [studentCourses, setStudentCourses] = useState([]);
    const [loading, setLoading] = useState(true);


    // Searching Data States
    const [courseSearch, setCourseSearch] = useState('');
    const [studentSearch, setStudentSearch] = useState('');
    const [studentCoursesSearch, setStudentCoursesSearch] = useState('');


    // Update Course States
    const [editCourse, setEditCourse] = useState(null);
    const [editStudent, setEditStudent] = useState(null);
    const [editStudentCourses, setEditStudentCourses] = useState(null);

    // Form and Notification States
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formType, setFormType] = useState('');
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });


    // Fetch Table Data and update states
    const fetchData = () => {
      setLoading(true);
      for (let i = 0; i < TOTAL_TABLE_FETCHES; i++){
        fetch(`http://localhost:3000/${TABLES[i]}`)
          .then(res => res.json())
          .then(data => {
            if (TABLES[i] === 'courses'){
              setCourses(data);
              setLoading(false);
            }
            if (TABLES[i] === 'students'){
              setStudents(data)
              setLoading(false);
            } 
            if (TABLES[i] === 'student_courses'){
              setStudentCourses(data)
              setLoading(false);
            }
          })
          .catch(err => {
            console.log(`Error Fetching ${TABLES[i]}: `, err);
            setLoading(false);
          })
      }
    };

    // We can definitely optimize this hook, but not much of
    // an issue atm
    useEffect(() => {
      fetchData();
    }, []);

    /*
    *  Course Data Methods
    */
    const addOrUpdateData = async (data, type) => {
      let isEdit;
      if (type === 'courses'){ isEdit = editCourse; }
      if (type === 'students'){ isEdit = editStudent; }
      if (type === 'student_courses'){ isEdit = editStudentCourses; }
      const method = isEdit ? 'PUT' : 'POST';
     
      let url = `http://localhost:3000/${type}`;
      if (isEdit) {
        if (type === 'student_courses') {
          url = `${url}/${isEdit.StudentID}/${isEdit.CourseID}`;
        } 
        if (type === 'courses') {
          const id = (type === 'courses') ? isEdit.CourseID : isEdit.StudentID;
          url = `${url}/${id}`;
        }
        if (type === 'students'){
          url = `${url}/${isEdit.StudentID}`
        }
      }

      try {
          const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
          if (!response.ok) {
            throw new Error(`Failed to ${isEdit ? 'update' : 'add'} ${type.replace('_', ' ')}`);
          }
          setNotification({ show: true, message: `${type.replace('_', ' ')} ${isEdit ? 'updated' : 'added'} successfully`, type: 'success'
          });
          fetchData();
      } catch (error) {
          setNotification({ show: true, message: error.message, type: 'error' });
      }
    }


    const handleDeleteTableData = async (id, table_name, studentID) => {
      if (table_name === 'student_courses') {
        await fetch(`http://localhost:3000/${table_name}/${studentID}/${id}`, { method: 'DELETE'});
      } else {
        await fetch(`http://localhost:3000/${table_name}/${id}`, { method: 'DELETE'});
      }
      fetchData();
    }

    const filteredCourses = courses.filter(c =>
      `${c.CoursePrefix}${c.CourseNumber}`.toLowerCase().includes(courseSearch.toLowerCase())
    );


    const filteredStudents = students.filter(s =>
        `${s.FirstName} ${s.LastName}`.toLowerCase().includes(studentSearch.toLowerCase())
    );


    const filteredStudentCourses = studentCourses.filter(sc =>
      `${sc.StudentID}`.toLowerCase().includes(studentCoursesSearch.toLowerCase())
    );


    return (
      <div className='dataContainer'>
        {/* Form and Notis Components */}
        <Form
         type={formType}
         isOpen={isFormOpen}
         onClose={() => {
           setIsFormOpen(false);
           setEditCourse(null);
           setEditStudent(null);
           setEditStudentCourses(null);
         }}
         onSubmit={ async (data) => {
           if (formType === 'courses') {
             addOrUpdateData(data, 'courses');
             // setNotification({ show: true, message: editCourse ? 'Course updated successfully' : 'Course added successfully', type: 'success' });
           }
           if (formType === 'students') {
             addOrUpdateData(data, 'students');
           }
           if (formType === 'student_courses') {
             addOrUpdateData(data, 'student_courses');
           }
           setIsFormOpen(false);
           setEditCourse(null);
           setEditStudent(null);
           setEditStudentCourses(null);
        }}
         initialData={formType === 'courses' ? editCourse : formType === 'students' ? editStudent : editStudentCourses}
        />
        <Notification
          isVisible={notification.show}
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ ...notification, show: false })}
        />

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
                <th>Course ID</th>
                <th>Prefix</th>
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
                  <td>{course.CourseID}</td>
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

        {/* We'll have students with their own tables and Each student will have a vertical scrollable
            Container that shows their courses using the cards
        */}
        {/* Student Section */}
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
                <th>StudentID</th>
                <th>FirstName</th>
                <th>LastName</th>
                <th>Email</th>
                <th>MajorID</th>
                <th>GraduationYear</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student.StudentID}>
                  <td>{student.StudentID}</td>
                  <td>{student.FirstName}</td>
                  <td>{student.LastName}</td>
                  <td>{student.Email}</td>
                  <td>{student.MajorID}</td>
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

        {/* Student_Courses Table */}
        <div className='studentCoursesTableContainer'>

          {/* Search Bar */}
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

        {/* Student Container */}
        <div className='student_Course_Container_Parent'>
          {!loading && filteredCourses && filteredStudents && studentCourses && filteredStudentCourses && (
            filteredStudents.map(student => {
              // Filter courses for this specific student using studentCourses join table.
              // This joins the tables so we can use data like names, course title, etc instead of just IDs
              // from the student_courses table

              const studentCourseIds = studentCourses
                .filter(sc => {
                  return String(sc.StudentID) === String(student.StudentID);
                })
                .map(sc => sc.CourseID);

              const studentSpecificCourses = filteredCourses.filter(course =>
                studentCourseIds.includes(course.CourseID)
              );

              return (
                <div key={student.StudentID} className='courses_Container_Parent'>
                  <div className='header2'>{`${student.FirstName} ${student.LastName}'s Courses`}</div>
                  <CardContainer
                    isAdmin={isAdmin}
                    courses={studentSpecificCourses}
                    setEditCourse={setEditCourse}
                    deleteStudentCourse={handleDeleteTableData}
                    studentID={student.StudentID}
                  />
                </div>
              )
            })
          )}
        </div>
      </div>
    );
}