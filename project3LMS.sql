CREATE TABLE location (
	LocationID INT auto_increment Primary Key,
    RoomNumber INT,
    Building VARCHAR(15)
);

CREATE TABLE majors (
	MajorID INT auto_increment Primary Key,
    Major VARCHAR(20)
);

CREATE TABLE courses (
	CourseID INT auto_increment Primary Key,
    CoursePrefix VARCHAR(8),
    CourseNumber INT,
    LocationID INT,
    StartTime DATE,
    
    CONSTRAINT course_locationInfo
		FOREIGN KEY (LocationID)
		REFERENCES location (LocationID)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE students (
	StudentID INT auto_increment Primary Key,
    FirstName VARCHAR(20),
    LastName VARCHAR(20),
    Email VARCHAR(30) UNIQUE,
    MajorID INT,
    GraduationYear INT,
    
    CONSTRAINT student_major
		FOREIGN KEY (MajorId)
        REFERENCES majors (MajorID)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE grades (
	GradeID INT auto_increment Primary Key,
    StudentID INT,
    CourseID INT,
	quiz1Grade FLOAT,
    quiz2Grade FLOAT,
    project1Grade FLOAT,
    project2Grade FLOAT,
    finalExamGrade FLOAT,
    
    CONSTRAINT grades_student
		FOREIGN KEY (StudentID) 
        REFERENCES students (StudentID)
        ON UPDATE CASCADE 
        ON DELETE CASCADE,
	CONSTRAINT grades_courses
		FOREIGN KEY (CourseID)
        REFERENCES courses (CourseID)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

# We can use a junction table between students/course
# instead of the central table since its a many-to-many relationship

CREATE TABLE student_courses (
	StudentID INT,
    CourseID INT,
    PRIMARY KEY (StudentID, CourseID),
    
    FOREIGN KEY (StudentID) 
    REFERENCES students (StudentID)
		ON UPDATE CASCADE
        ON DELETE CASCADE,
	FOREIGN KEY (CourseID) 
    REFERENCES courses (CourseID)
		ON UPDATE CASCADE
        ON DELETE CASCADE
);

