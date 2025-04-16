import React, { useState } from 'react';
import '../App.css';

const CardContainer = ({ isAdmin, courses = [], setEditCourse, deleteCourse, studentID }) => {

  const [uniqueStudentCourses, setUniqueStudentCourses] = useState([courses[studentID]]);

  return (
      // We want it so the courses display based on the student
      // and the courses each of them have (Not display all in one card)
      <div className='student_course_container'>
      {uniqueStudentCourses.map(course => (
        <div className='course_Card_Container' key={course.StudentID}>
          <div className='course_Title_Container'>
            <h2 className='cardHeader2'>{course.StudentID} - {course.CourseID}</h2>
          </div>
          {/* <div className='course_Room_Container'>
            <p className='cardText'>Room {course.RoomNumber}</p>
            <p className='cardText'>{course.Building}</p>
          </div>
          <div className='course_Time_Container'>
            <p className='cardText'>{course.StartTime}</p>
          </div> */}
          {isAdmin && (
            <div className='course_Actions_Container'>
              <button onClick={() => setEditCourse(course)}>Edit</button>
              <button onClick={() => deleteCourse(course.CourseID)}>Delete</button>
            </div>
          )}
        </div>
      ))}
      </div>
  );
};

export default CardContainer;