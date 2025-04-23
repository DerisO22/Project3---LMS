import { useEffect, useState } from 'react';
import '../App.css';
import CardContainer from './CardContainer';
import Form from './Form'; 
import Notification from './Notification'; 
import CoursesTable from './Dashboard_components/CoursesTable';
import StudentsTable from './Dashboard_components/StudentsTable';
import StudentCoursesTable from './Dashboard_components/StudentCoursesTable';
import GradeTable from './Dashboard_components/GradeTable';

const TOTAL_TABLE_FETCHES = 4;
const TABLES = ['courses', 'students', 'student_courses', 'grades'];

export default function Dashboard({ isAdmin }) {
    // Table Data States
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [studentCourses, setStudentCourses] = useState([]);
    const [studentGrades, setStudentGrades] = useState([]);
    const [loading, setLoading] = useState(true);

    // Searching Data States
    const [courseSearch, setCourseSearch] = useState('');
    const [studentSearch, setStudentSearch] = useState('');
    const [studentCoursesSearch, setStudentCoursesSearch] = useState('');
    const [studentGradeSearch, setStudentGradeSearch] = useState('');

    // Update Course States
    const [editCourse, setEditCourse] = useState(null);
    const [editStudent, setEditStudent] = useState(null);
    const [editStudentCourses, setEditStudentCourses] = useState(null);
    const [editStudentGrades, setEditStudentGrades] = useState(null);

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
              setStudents(data);
              setLoading(false);
            } 
            if (TABLES[i] === 'student_courses'){
              setStudentCourses(data);
              setLoading(false);
            }
            if (TABLES[i] === 'grades'){
              setStudentGrades(data);
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
    *  Table Data Methods (add, update, delete, filtersearch)
    */
    const addOrUpdateData = async (data, type) => {
      let isEdit;
      if (type === 'courses'){ isEdit = editCourse; }
      if (type === 'students'){ isEdit = editStudent; }
      if (type === 'student_courses'){ isEdit = editStudentCourses; }
      if (type === 'grades') { isEdit = editStudentGrades; }
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
        if (type === 'students') {
          url = `${url}/${isEdit.StudentID}`
        }
        if (type === 'grades') {
          url = `${url}/${isEdit.StudentID}/${isEdit.CourseID}`
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
          setNotification({ show: true, message: `${type.replace('_', ' ')} ${isEdit ? 'updated' : 'added'} successfully`, type: 'success'});
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

    // Search Bar Filter
    const filteredCourses = courses.filter(c =>
      `${c.CoursePrefix}${c.CourseNumber}`.toLowerCase().includes(courseSearch.toLowerCase())
    );

    const filteredStudents = students.filter(s =>
        `${s.FirstName} ${s.LastName}`.toLowerCase().includes(studentSearch.toLowerCase())
    );

    const filteredStudentCourses = studentCourses.filter(sc =>
      `${sc.StudentID}`.toLowerCase().includes(studentCoursesSearch.toLowerCase())
    );

    const filteredGrades = studentGrades.filter(g => 
      `${g.FirstName}`.toLowerCase().includes(studentGradeSearch.toLowerCase())
    );

    return (
      <div className='dataContainer'>
        {/* 
        *
        *   Form Component 
        * 
        */}
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
           }
           if (formType === 'students') {
             addOrUpdateData(data, 'students');
           }
           if (formType === 'grades') {
            addOrUpdateData(data, 'grades')
           }
           if (formType === 'student_courses') {
             addOrUpdateData(data, 'student_courses');
           }
           setIsFormOpen(false);
           setEditCourse(null);
           setEditStudent(null);
           setEditStudentCourses(null);
           setEditStudentGrades(null);
        }}
          initialData={formType === 'courses' ? editCourse : formType === 'students' ? editStudent : formType === 'student_courses' ? editStudentCourses: editStudentGrades}
          studentData={students}
          courseData={courses}
        />

        {/* 
        *
        *   Notficiation Component
        * 
        */}
        <Notification
          isVisible={notification.show}
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ ...notification, show: false })}
        />

        {/* 
        *
        *   Table Components
        * 
        */}
        <CoursesTable 
          isAdmin={isAdmin}
          filteredCourses={filteredCourses}
          setEditCourse={setEditCourse}
          setFormType={setFormType}
          setIsFormOpen={setIsFormOpen}
          handleDeleteTableData={handleDeleteTableData}
          setNotification={setNotification}
          courseSearch={courseSearch}
          setCourseSearch={setCourseSearch}
          setEditStudent={setEditStudent}
        />

        <StudentsTable 
          isAdmin={isAdmin}
          filteredStudents={filteredStudents}
          setEditStudent={setEditStudent}
          setFormType={setFormType}
          setIsFormOpen={setIsFormOpen}
          handleDeleteTableData={handleDeleteTableData}
          setNotification={setNotification}
          studentSearch={studentSearch}
          setStudentSearch={setStudentSearch}
        />

        <GradeTable 
          isAdmin = {isAdmin}
          filteredGrades = {filteredGrades}
          setEditStudentGrades = {setEditStudentGrades}
          setFormType= {setFormType}
          setIsFormOpen= {setIsFormOpen}
          handleDeleteTableData= {handleDeleteTableData}
          setNotification= {setNotification}
          studentGradeSearch = {studentGradeSearch}
          setStudentGradeSearch = {setStudentGradeSearch}
        />

        <StudentCoursesTable 
          isAdmin={isAdmin}
          filteredStudentCourses={filteredStudentCourses}
          setEditStudentCourses={setEditStudentCourses}
          setFormType={setFormType}
          setIsFormOpen={setIsFormOpen}
          handleDeleteTableData={handleDeleteTableData}
          setNotification={setNotification}
          studentCoursesSearch={studentCoursesSearch}
          setStudentCoursesSearch={setStudentCoursesSearch}
        />

        {/* Course Card Containers */}
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
                    setNotification={setNotification}
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