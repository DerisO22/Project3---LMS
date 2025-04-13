# Tables We Need:
# students <-> student_courses <-> courses
# location
# grades, majors

# *** course_materials table and course section number
#     will be implemented on the frontend ***
# Insert Data to test the duplicate course section constraint isn't in 
# this code, but will be included when implemented on the front-end

CREATE TABLE location (
	LocationID INT auto_increment Primary Key,
    RoomNumber INT,
    # We could add a buildings table to remove even 
    # more redundancy but we'll it simple for now
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
    StartTime TIME,
    
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

# Insert Value Statements
# Info for courses DAT-210, DAT-410, CSI-300-01, and CSI-300-02
# *** INSERT the data in the same order as we created the tables ***
INSERT INTO majors (Major)
VALUES ('Data Science'),
	   ('Computer Science');

INSERT INTO location (RoomNumber, Building)
VALUES (210, 'Joyce Hall'),
	   (201, 'Joyce Hall');

# Course Related Data
INSERT INTO courses (CourseID, CoursePrefix, CourseNumber, LocationID, StartTime)
VALUES (1, 'DAT-210', 0, 1, '10:00:00'),
	   (2, 'DAT-410', 0, 1, '11:30:00'),
       (3, 'CSI-300', 01, 2, '10:00:00'),
       (4, 'CSI-300', 02, 2, '11:30:00');

# Student Related Data
INSERT INTO students (FirstName, LastName, Email, MajorID, GraduationYear)
VALUES ('Bob', 'Bash', 'bob.bash@champlain.edu', 1, 2026),
	   ('Cindy', 'Calibre', 'cindy.calibre@champlain.edu', 2, 2027),
       ('Jack', 'Jenkins', 'jack.jenkins@champlain.edu', 2, 2025),
       ('Rondo', 'Redis', 'rondo.redis@champlain.edu', 1, 2026);
       
INSERT INTO grades (StudentID, CourseID, quiz1Grade, quiz2Grade, project1Grade, project2Grade, finalExamGrade)
VALUES (1, 4, 89.4, 93.2, 92.7, 96.5, 94.0),
	   (2, 1, 92.2, 84.5, 94.0, 91.7, 93.1),
       (3, 2, 87.9, 93.0, 98.1, 94.8, 89.6),
       (4, 3, 87.4, 95.1, 94.6, 93.3, 99.0);

# Junction Table Data
INSERT INTO student_courses(StudentID, CourseID)
VALUES (1, 4), 
	   (2, 1),
       (3, 2),
       (4, 3);

# SELECT * FROM courses;
# SELECT * FROM grades;
# SELECT * FROM location;
# SELECT * FROM majors;
# SELECT * FROM students;
# SElECT * FROM student_courses;