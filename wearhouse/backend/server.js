const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();


app.use(cors());
app.use(express.json());


// Auth
app.post('/login', (req, res) => {
 const { user, password } = req.body;
 if (user === 'ADMIN' && password === 'ADMIN') {
   res.json({ success: true });
 } else {
   res.status(401).json({ success: false });
 }
});


// CRUD
/*
 Create Table Method (post)
*/
// Add new course
app.post('/courses', (req, res) => {
  const { CoursePrefix, CourseNumber, RoomNumber, Building, StartTime } = req.body;
  db.run (
    'INSERT OR REPLACE INTO location (RoomNumber, Building) VALUES (?, ?)',
   [RoomNumber, Building],
   function(err) {
    if (err) return res.status(500).json(err);
    const locationID = this.lastID;

    db.run(
      'INSERT INTO courses (CoursePrefix, CourseNumber, locationID, StartTime) VALUES (?, ?, ?, ?)',
      [CoursePrefix, CourseNumber, locationID, StartTime],
      function(err) {
        if (err) return res.status(500).json(err);
        res.json({ id: this.lastID });
      }
      )
  });
});


app.post('/students/', (req, res) => {
 const { FirstName, LastName, Email, MajorID, GraduationYear } = req.body;

 db.run(
   'INSERT INTO students (FirstName, LastName, Email, MajorID, GraduationYear) VALUES (?, ?, ?, ?, ?)',
   [FirstName, LastName, Email, MajorID, GraduationYear],
   function(err){
     if (err) return res.status(500).json(err);
     res.json({ id: this.lastID })
   }
 );
});


app.post('/student_courses/', (req, res) => {
  const { StudentID, CourseID } = req.body;

  db.get(`
    SELECT c1.CoursePrefix, c1.CourseNumber 
    FROM courses c1 
    JOIN student_courses sc ON sc.CourseID = c1.CourseID 
    JOIN courses c2 ON c2.CourseID = ? 
    WHERE sc.StudentID = ? AND c1.CoursePrefix = c2.CoursePrefix`, 
    [CourseID, StudentID], 
    (err, row) => {
    if (err) return res.status(500).json(err);
    
    if (row) {
      return res.status(400).json({ error: `Student is already enrolled in ${row.CoursePrefix}-${row.CourseNumber}` });
    }

    db.run(
      'INSERT INTO student_courses (StudentID, CourseID) VALUES (?, ?)',
      [StudentID, CourseID],
      function (err) {
        if (err) return res.status(500).json(err);
        res.json({ id: this.lastID })
      }
    );
  });
});

app.post('/grades/', (req, res) => {
  const { StudentID, CourseID, quiz1Grade, quiz2Grade, project1Grade, project2Grade, finalExamGrade } = req.body;

  db.run(
    'INSERT OR IGNORE INTO grades (StudentID, CourseID, quiz1Grade, quiz2Grade, project1Grade, project2Grade, finalExamGrade) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [StudentID, CourseID, quiz1Grade, quiz2Grade, project1Grade, project2Grade, finalExamGrade],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ id: this.lastID })
    }
  )
});


/*
 Read Table API Endpoints (get)
*/
// Get all courses with location info
app.get('/courses', (req, res) => {
 db.all(`
   SELECT c.*, l.RoomNumber, l.Building
   FROM courses c
   LEFT JOIN location l ON c.LocationID = l.LocationID
 `, [], (err, rows) => {
   if (err) return res.status(500).json(err);
   res.json(rows);
 });
});


// Get all students with their majors
app.get('/students', (req, res) => {
 db.all(`
   SELECT s.*, m.Major
   FROM students s
   LEFT JOIN majors m ON s.MajorID = m.MajorID
 `, [], (err, rows) => {
   if (err) return res.status(500).json(err);
   res.json(rows);
 });
});

// Get grade table data
app.get('/grades', (req, res) => {
  db.all(`
    SELECT g.*, s.FirstName, s.LastName, c.CoursePrefix, c.CourseNumber
    FROM grades g
    JOIN students s ON s.StudentID = g.StudentID
    JOIN courses c ON c.CourseID = g.CourseID
    `, [], (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    }
  )
})

// Get student_courses table data
app.get('/student_courses', (req, res) => {
 db.all(`
   SELECT sc.StudentID, sc.CourseID, s.FirstName, s.LastName, c.CoursePrefix, c.CourseNumber
   FROM student_courses sc
   JOIN students s ON s.StudentID = sc.StudentID
   JOIN courses c ON c.CourseID = sc.CourseID
 `, [], (err, rows) => {
   if (err) return res.status(500).json(err);
   res.json(rows);
 });
});


/*
 Update Table API Endpoints (put)
*/
app.put('/courses/:id', (req, res) => {
 const { CoursePrefix, CourseNumber, RoomNumber, Building, StartTime } = req.body;

 db.run(
   'INSERT OR REPLACE INTO location (RoomNumber, Building) VALUES (?, ?)',
   [RoomNumber, Building],
   function(err) {
     if (err) return res.status(500).json(err);
     const locationId = this.lastID;


     db.run(
       'UPDATE courses SET CoursePrefix = ?, CourseNumber = ?, LocationID = ?, StartTime = ? WHERE CourseID = ?',
       [CoursePrefix, CourseNumber, locationId, StartTime, req.params.id],
       function(err) {
         if (err) return res.status(500).json(err);
         res.json({ updated: this.changes });
       }
     );
   }
 );
});


// Update Students Table
app.put('/students/:id', (req, res) => {
 const { FirstName, LastName, Email, MajorID, GraduationYear } = req.body;

 db.run(
   'UPDATE students SET FirstName = ?, LastName = ?, Email = ?, MajorID = ?, GraduationYear = ? WHERE StudentID = ?',
   [FirstName, LastName, Email, MajorID, GraduationYear, req.params.id],
   function(err){
     if (err) return res.status(500).json(err);
     res.json({ updated: this.changes })
   }
 );
});

// Update Grades Table
app.put('/grades/:studentId/:courseId', (req, res) => {
  const { quiz1Grade, quiz2Grade, project1Grade, project2Grade, finalExamGrade } = req.body;
  const { studentId, courseId } = req.params;

  db.run(
    'UPDATE grades SET quiz1Grade = ?, quiz2Grade = ?, project1Grade = ?, project2Grade = ?, finalExamGrade = ? WHERE StudentID = ? AND CourseID = ?',
    [quiz1Grade, quiz2Grade, project1Grade, project2Grade, finalExamGrade, studentId, courseId],
    function(err) {
      if (err) return res.status(500).json(err);
      res.json({ updated: this.changes });
    }
  );
});

// Update student_courses Table
app.put('/student_courses/:studentId/:courseId', (req, res) => {
  const { StudentID, CourseID } = req.body;
  const { studentId, courseId } = req.params;

  // First check if student is already enrolled in another section of the same course
  db.get(`
    SELECT c1.CoursePrefix, c1.CourseNumber 
    FROM courses c1 
    JOIN student_courses sc ON sc.CourseID = c1.CourseID 
    JOIN courses c2 ON c2.CourseID = ? 
    WHERE sc.StudentID = ? AND c1.CoursePrefix = c2.CoursePrefix 
    AND sc.CourseID != ?`,
    [CourseID, StudentID, courseId],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });

      if (row) {
        return res.status(400).json({ error: `Student is already enrolled in ${row.CoursePrefix}-${row.CourseNumber}` });
      }

      // If no duplicate found, proceed with update
      db.serialize(() => {
        db.run('DELETE FROM student_courses WHERE StudentID = ? AND CourseID = ?',
          [studentId, courseId],
          function(err) {
            if (err) return res.status(500).json({ error: err.message });
          }
        );

        db.run('INSERT INTO student_courses (StudentID, CourseID) VALUES (?, ?)',
          [StudentID, CourseID],
          function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ updated: true });
          }
        );
      });
    }
  );
});


/*
 Delete Table Row API Endpoints (delete)
*/
// Delete Row From Student_Course Table
app.delete('/student_courses/:studentId/:courseId', (req, res) => {
 db.run(
   'DELETE FROM student_courses WHERE StudentID = ? AND CourseID = ?',
   [req.params.studentId, req.params.courseId],
   function(err) {
     if (err) return res.status(500).json(err);
     res.json({ deleted: this.changes });
   }
 );
});

//Delete Student
app.delete('/students/:id', (req, res) => {
 db.run('DELETE FROM students WHERE StudentID = ?', [req.params.id], function(err) {
   if (err) return res.status(500).json(err);
   res.json({ deleted: this.changes });
 });
});

//Delete Student's Grades
app.delete('/grades/:id', (req, res) => {
  db.run('DELETE FROM grades WHERE GradeID = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json(err);
    res.json({ deleted: this.changes });
  });
 });

// Delete course
app.delete('/courses/:id', (req, res) => {
 db.run('DELETE FROM courses WHERE CourseID = ?', [req.params.id], function(err) {
   if (err) return res.status(500).json(err);
   res.json({ deleted: this.changes });
 });
});


app.listen(3000, '0.0.0.0', () => console.log('Server running on port 3000'));