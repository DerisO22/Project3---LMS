import { useState } from "react";

const CardContainer = ({ isAdmin, courses = [], setEditCourse, deleteStudentCourse, studentID, setNotification, setEditStudentCourses, setFormType, setIsFormOpen }) => {

    if ( !Array.isArray(courses) || courses.length === 0) {
        return <div className='student_course_container'>No courses available</div>;
    }

    const handleEdit = (course) => {
        setEditStudentCourses({
            StudentID: studentID,
            CourseID: course.CourseID,
            ...course
        });
        setFormType('student_courses_card');
        setIsFormOpen(true);
    };

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
                        <p className='cardText'>Start Time: {course.StartTime || 'N/A'} {course.StartTime.split(':')[0] <= 12 ? 'AM' : 'PM'}</p>
                        <button className="downloadButton"
                            onClick = {() => {
                                window.open(`./${course.CoursePrefix}_Syllabus.pdf`)
                            }}
                            >
                            Open Syllabus
                        </button>
                    </div>
                    {isAdmin && (
                        <div className='course_Actions_Container'>
                            {/* <button onClick={() => {
                                setEditStudentCourses(course);
                                setFormType('student_courses_card');
                                setIsFormOpen(true);
                            }}>Edit</button> */}
                            <button onClick={() => handleEdit(course)}>Edit</button>
                            <button onClick={() => {
                                deleteStudentCourse(course.CourseID, 'student_courses', studentID)
                                setNotification({ show: true, message: `Student's Course deleted successfully`, type: 'success' });
                            }}>Delete</button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};


export default CardContainer;