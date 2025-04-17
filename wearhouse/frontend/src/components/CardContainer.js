

import React from 'react';
import '../App.css';


const CardContainer = ({ isAdmin, courses = [], setEditCourse, deleteCourse }) => {
 if (!courses || courses.length === 0) {
   return <div className='student_course_container'>No courses available</div>;
 }


 return (
   <div className='student_course_container'>
     {courses.map(course => (
       <div className='course_Card_Container' key={course.CourseID}>
         <div className='course_Title_Container'>
           <h2 className='cardHeader2'>{course.CoursePrefix}-{course.CourseNumber}</h2>
         </div>
         <div className='course_Room_Container'>
           <p className='cardText'>Room {course.RoomNumber || 'N/A'}</p>
           <p className='cardText'>{course.Building || 'N/A'}</p>
         </div>
         <div className='course_Time_Container'>
           <p className='cardText'>{course.StartTime || 'N/A'}</p>
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