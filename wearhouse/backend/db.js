
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.resolve(__dirname, 'db.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Create tables
  db.run(`CREATE TABLE IF NOT EXISTS location (
    LocationID INTEGER PRIMARY KEY AUTOINCREMENT,
    RoomNumber INTEGER,
    Building TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS majors (
    MajorID INTEGER PRIMARY KEY AUTOINCREMENT,
    Major TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS courses (
    CourseID INTEGER PRIMARY KEY AUTOINCREMENT,
    CoursePrefix TEXT,
    CourseNumber INTEGER,
    LocationID INTEGER,
    StartTime TEXT,
    FOREIGN KEY (LocationID) REFERENCES location (LocationID)
      ON UPDATE CASCADE
      ON DELETE CASCADE
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS students (
    StudentID INTEGER PRIMARY KEY AUTOINCREMENT,
    FirstName TEXT,
    LastName TEXT,
    Email TEXT UNIQUE,
    MajorID INTEGER,
    GraduationYear INTEGER,
    FOREIGN KEY (MajorID) REFERENCES majors (MajorID)
      ON UPDATE CASCADE
      ON DELETE CASCADE
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS grades (
    GradeID INTEGER PRIMARY KEY AUTOINCREMENT,
    StudentID INTEGER,
    CourseID INTEGER,
    quiz1Grade REAL,
    quiz2Grade REAL,
    project1Grade REAL,
    project2Grade REAL,
    finalExamGrade REAL,
    FOREIGN KEY (StudentID) REFERENCES students (StudentID)
      ON UPDATE CASCADE
      ON DELETE CASCADE,
    FOREIGN KEY (CourseID) REFERENCES courses (CourseID)
      ON UPDATE CASCADE
      ON DELETE CASCADE
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS student_courses (
    StudentID INTEGER,
    CourseID INTEGER,
    PRIMARY KEY (StudentID, CourseID),
    FOREIGN KEY (StudentID) REFERENCES students (StudentID)
      ON UPDATE CASCADE
      ON DELETE CASCADE,
    FOREIGN KEY (CourseID) REFERENCES courses (CourseID)
      ON UPDATE CASCADE
      ON DELETE CASCADE
  )`);

  // Insert initial data
  db.run(`INSERT OR IGNORE INTO majors (Major) VALUES ('Data Science'), ('Computer Science')`);
  
  db.run(`INSERT OR IGNORE INTO location (RoomNumber, Building) VALUES 
    (210, 'Joyce Hall'),
    (201, 'Joyce Hall')`);

  db.run(`INSERT OR IGNORE INTO courses (CoursePrefix, CourseNumber, LocationID, StartTime) VALUES 
    ('DAT-210', 0, 1, '10:00:00'),
    ('DAT-410', 0, 1, '11:30:00'),
    ('CSI-300', 1, 2, '10:00:00'),
    ('CSI-300', 2, 2, '11:30:00')`);

  db.run(`INSERT OR IGNORE INTO students (FirstName, LastName, Email, MajorID, GraduationYear) VALUES 
    ('Bob', 'Bash', 'bob.bash@champlain.edu', 1, 2026),
    ('Cindy', 'Calibre', 'cindy.calibre@champlain.edu', 2, 2027),
    ('Jack', 'Jenkins', 'jack.jenkins@champlain.edu', 2, 2025),
    ('Rondo', 'Redis', 'rondo.redis@champlain.edu', 1, 2026)`);

  db.run(`INSERT OR IGNORE INTO grades (StudentID, CourseID, quiz1Grade, quiz2Grade, project1Grade, project2Grade, finalExamGrade)
    VALUES (1, 4, 89.4, 93.2, 92.7, 96.5, 94.0),
    (2, 1, 92.2, 84.5, 94.0, 91.7, 93.1),
    (3, 2, 87.9, 93.0, 98.1, 94.8, 89.6),
    (4, 3, 87.4, 95.1, 94.6, 93.3, 99.0);`)

  db.run(`INSERT OR IGNORE INTO student_courses(StudentID, CourseID)
    VALUES (1, 4), 
    (2, 1),
    (3, 2),
    (4, 3);`);
});

module.exports = db;