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

// Get student_courses table data
app.get('/student_courses', (req, res) => {
  db.all(`
    SELECT sc.StudentID, sc.CourseID
    FROM student_courses sc
    JOIN students s ON s.StudentID = sc.StudentID
    JOIN courses c ON c.CourseID = sc.CourseID
  `, [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// Add new course
app.post('/courses', (req, res) => {
  const { CoursePrefix, CourseNumber, LocationID, StartTime } = req.body;
  db.run(
    'INSERT INTO courses (CoursePrefix, CourseNumber, LocationID, StartTime) VALUES (?, ?, ?, ?)',
    [CoursePrefix, CourseNumber, LocationID, StartTime],
    function(err) {
      if (err) return res.status(500).json(err);
      res.json({ id: this.lastID });
    }
  );
});

// Update course

app.put('/courses/:id', (req, res) => {
  const { CoursePrefix, CourseNumber, Building, RoomNumber, StartTime } = req.body;
  // Find or create location
  db.get('SELECT LocationID FROM location WHERE Building = ? AND RoomNumber = ?', [Building, RoomNumber], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to find location' });
    }

    let locationID;
    if (row) {
      locationID = row.LocationID;
      updateCourse(locationID);
    } else {
      db.run('INSERT INTO location (Building, RoomNumber) VALUES (?, ?)', [Building, RoomNumber], function(err) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to create location' });
        }
        locationID = this.lastID;
        updateCourse(locationID);
      });
    }
  });

  function updateCourse(locationID) {
    db.run(
      'UPDATE courses SET CoursePrefix = ?, CourseNumber = ?, LocationID = ?, StartTime = ? WHERE CourseID = ?',
      [CoursePrefix, CourseNumber, locationID, StartTime, req.params.id],
      function(err) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to update course' });
        }
        
        if (this.changes === 0) {
          return res.status(404).json({ error: 'Course not found' });
        }
        
        res.json({ updated: this.changes });
      }
    );
  }
});

/* Needed API EndPoints for the other Updates / Deletes (Ryan) */

// Update Student
app.put('/students/:id', (req, res) => {
  const { FirstName, LastName, Email, MajorID, GraduationYear } = req.body;
  db.run(
    'UPDATE students SET FirstName = ?, LastName = ?, Email = ?, MajorID = ?, GraduationYear = ? WHERE StudentID = ?',
    [FirstName, LastName, Email, MajorID, GraduationYear, req.params.id],
    function(err) {
      if (err) return res.status(500).json(err);
      res.json({ updated: this.changes });
    }
  );
});

// Update Student
// app.put('/students/:id', (req, res) => {
//   console.log('Updating student with ID:', req.params.id);
//   console.log('Request body:', req.body);
  
//   const { FirstName, LastName, Email, MajorID, GraduationYear } = req.body;
//   db.run(
//     'UPDATE students SET FirstName = ?, LastName = ?, Email = ?, MajorID = ?, GraduationYear = ? WHERE StudentID = ?',
//     [FirstName, LastName, Email, MajorID, GraduationYear, req.params.id],
//     function(err) {
//       if (err) {
//         console.error('Error updating student:', err);
//         return res.status(500).json(err);
//       }
//       console.log('Update result:', this.changes);
//       res.json({ updated: this.changes });
//     }
//   );
// });


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

// Delete course
app.delete('/courses/:id', (req, res) => {
  db.run('DELETE FROM courses WHERE CourseID = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json(err);
    res.json({ deleted: this.changes });
  });
});

app.listen(3000, '0.0.0.0', () => console.log('Server running on port 3000'));