import React from 'react';
import '../App.css';


const CardContainer = ({ isAdmin, courses = [], setEditCourse, deleteCourse }) => {
 return (
    <div className='student_course_container'>
     {courses.map(course => (
       <div className='course_Card_Container' key={course.CourseID}>
         <div className='course_Title_Container'>
           <h2 className='cardHeader2'>{course.CoursePrefix}-{course.CourseNumber}</h2>
         </div>
         <div className='course_Room_Container'>
           <p className='cardText'>Room {course.RoomNumber}</p>
           <p className='cardText'>{course.Building}</p>
         </div>
         <div className='course_Time_Container'>
           <p className='cardText'>{course.StartTime}</p>
         </div>
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