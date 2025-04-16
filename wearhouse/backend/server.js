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
    SELECT *
    FROM student_courses 
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
  const { CoursePrefix, CourseNumber, LocationID, StartTime } = req.body;
  db.run(
    'UPDATE courses SET CoursePrefix = ?, CourseNumber = ?, LocationID = ?, StartTime = ? WHERE CourseID = ?',
    [CoursePrefix, CourseNumber, LocationID, StartTime, req.params.id],
    function(err) {
      if (err) return res.status(500).json(err);
      res.json({ updated: this.changes });
    }
  );
});


// Delete Row From Student_Course Table
app.delete('/student_courses/:id', (req, res) => {
  db.run('DELETE FROM student_courses WHERE StudentID = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json(err);
    res.json({ deleted: this.changes });
  });
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