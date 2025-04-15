import { useEffect, useState } from 'react';
import '../App.css';
import CardContainer from './CardContainer';


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

  // Fetch Table Data and update states
  const fetchData = () => {
    setLoading(true);
    // Fetch course data
    fetch('http://localhost:3000/courses')
      .then(res => res.json())
      .then(data => {
        setCourses(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching courses:', err);
        setLoading(false);
      });
    // Fetch student data
    fetch('http://localhost:3000/students')
      .then(res => res.json())
      .then(data => {
        setStudents(data);
        setLoading(false)
      })
      .catch(err => {
        console.log('Error Fetching students:', err);
        setLoading(false);
      })
    // Fetch Student Courses Data
    fetch('http://localhost:3000/student_courses')
      .then(res => res.json())
      .then(data => {
        setStudentCourses(data);
        setLoading(false)
      })
      .catch(err => {
        console.log('Error Fetching student courses:', err);
        setLoading(false);
      })
  };

  // We can definitely optimize this, but not much of an issue atm
  useEffect(() => {
    fetchData();
  }, []);

  /*
  *  Course Data Methods
  */
  const addOrUpdateCourse = async (data) => {
    const method = editCourse ? 'PUT' : 'POST';
    const url = editCourse
      ? `http://localhost:3000/courses/${editCourse.CourseID}`
      : 'http://localhost:3000/courses';


    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setEditCourse(null);
    fetchData();
  };


  const deleteCourse = async (id) => {
    await fetch(`http://localhost:3000/courses/${id}`, { method: 'DELETE' });
    fetchData();
  };

  /*
  *  Student Data Methods (Implement Later On)
  *  Issue with fetching where its conflicting with
  *  the courses app.delete() 
  */
  const addStudent = async (data) => {

  }

  const editStudentData = async (data) => {

  };

  const deleteStudentData = async (id) => {
    await fetch(`http://localhost:3000/students/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const deleteStudentCoursesData = async (id) => {
    console.log("Deleted Student:", id);
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
      <h2 className='header2'>Course Management</h2>
      {/* Course Search Bar */}
      <input
        placeholder="Search courses..."
        value={courseSearch}
        onChange={e => setCourseSearch(e.target.value)}
        style={{ marginBottom: '1em', padding: '4px', width: '300px' }}
      />


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
                    <button onClick={() => setEditCourse(course)}>Edit</button>
                    <button onClick={() => deleteCourse(course.CourseID)}>Delete</button>
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
                    <button onClick={() => setEditStudent(student)}>Edit</button>
                    <button onClick={() => deleteStudentData(student.StudentID)}>Delete</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Student_Courses Table */}
      <div className='tableContainer'>
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
              <tr key={sc.StudentID}>
                <td>{sc.StudentID}</td>
                <td>{sc.CourseID}</td>
                {isAdmin && (
                  <td className='table_Actions_Container'>
                    <button onClick={() => setEditStudentCourses(sc.StudentID)}>Edit</button>
                    <button onClick={() => deleteStudentCoursesData(sc.StudentID)}>Delete</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Student Container */}
      <div className='student_Course_Container_Parent'>
        {!loading && filteredCourses && (
          filteredStudents.map(student => (
            <div className='courses_Container_Parent'>
              <div className='header2'>{`${student.FirstName} ${student.LastName}'s Courses`}</div>
              <CardContainer
                isAdmin={isAdmin}
                courses={filteredCourses}
                setEditCourse={setEditCourse}
                deleteCourse={deleteCourse}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}