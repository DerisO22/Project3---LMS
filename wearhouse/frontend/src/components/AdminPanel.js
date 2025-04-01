import React, { useState } from 'react';

function AdminPanel({ courses, refreshCourses, competencies }) {
  // State for adding a course
  const [newCourseId, setNewCourseId] = useState('');
  const [newCourseComps, setNewCourseComps] = useState(() => {
    const initial = {};
    competencies.forEach(comp => (initial[comp] = 0));
    return initial;
  });
  const [addMessage, setAddMessage] = useState('');
  const [addError, setAddError] = useState(false);

  // State for updating a course
  const [updateSelectedId, setUpdateSelectedId] = useState('');
  const [updateComps, setUpdateComps] = useState(() => {
    const initial = {};
    competencies.forEach(comp => (initial[comp] = 0));
    return initial;
  });
  const [updateMessage, setUpdateMessage] = useState('');
  const [updateError, setUpdateError] = useState(false);

  // State for deleting a course
  const [deleteSelectedId, setDeleteSelectedId] = useState('');
  const [deleteMessage, setDeleteMessage] = useState('');
  const [deleteError, setDeleteError] = useState(false);

  // Handle changes for new course competencies
  const handleNewCourseCompChange = (comp, value) => {
    setNewCourseComps(prev => ({
      ...prev,
      [comp]: Number(value)
    }));
  };

  // Add a new course
  const handleAddCourse = (e) => {
    e.preventDefault();
    const id = newCourseId.trim().toUpperCase();
    if (!id) {
      setAddMessage('Course ID is required.');
      setAddError(true);
      return;
    }
    // POST request to add course
    fetch('http://localhost:5000/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, competencies: newCourseComps }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setAddMessage(data.error);
          setAddError(true);
        } else {
          setAddMessage('Course added successfully!');
          setAddError(false);
          setNewCourseId('');
          const reset = {};
          competencies.forEach(comp => { reset[comp] = 0; });
          setNewCourseComps(reset);
          refreshCourses();
        }
      })
      .catch(() => {
        setAddMessage('Error adding course.');
        setAddError(true);
      });
  };

  // Update course selection to load current competency values
  const handleSelectUpdateCourse = (id) => {
    setUpdateSelectedId(id);
    const course = courses.find(c => c.id === id);
    if (course) {
      setUpdateComps({ ...course.competencies });
      setUpdateMessage('');
      setUpdateError(false);
    }
  };

  // Handle update competency changes
  const handleUpdateCompChange = (comp, value) => {
    setUpdateComps(prev => ({
      ...prev,
      [comp]: Number(value)
    }));
  };

  // Update an existing course
  const handleUpdateCourse = (e) => {
    e.preventDefault();
    if (!updateSelectedId) {
      setUpdateMessage('No course selected to update.');
      setUpdateError(true);
      return;
    }
    fetch(`http://localhost:5000/api/courses/${updateSelectedId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ competencies: updateComps }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setUpdateMessage(data.error);
          setUpdateError(true);
        } else {
          setUpdateMessage('Course updated successfully!');
          setUpdateError(false);
          refreshCourses();
        }
      })
      .catch(() => {
        setUpdateMessage('Error updating course.');
        setUpdateError(true);
      });
  };

  // Delete a course
  const handleDeleteCourse = (e) => {
    e.preventDefault();
    if (!deleteSelectedId) {
      setDeleteMessage('No course selected to delete.');
      setDeleteError(true);
      return;
    }
    fetch(`http://localhost:5000/api/courses/${deleteSelectedId}`, {
      method: 'DELETE',
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setDeleteMessage(data.error);
          setDeleteError(true);
        } else {
          setDeleteMessage(`Course ${deleteSelectedId} deleted successfully.`);
          setDeleteError(false);
          refreshCourses();
          setDeleteSelectedId('');
        }
      })
      .catch(() => {
        setDeleteMessage('Error deleting course.');
        setDeleteError(true);
      });
  };

  return (
    <div>
      <h2>Admin Panel</h2>

      {/* Add Course Form */}
      <div className="form-section">
        <h3>Add a New Course</h3>
        <form onSubmit={handleAddCourse}>
          <div className="field">
            <label>Course ID:</label>
            <input
              type="text"
              value={newCourseId}
              onChange={(e) => setNewCourseId(e.target.value)}
              required
            />
          </div>
          <div className="fields-grid">
            {competencies.map((comp) => (
              <div className="field" key={comp}>
                <label>{comp}:</label>
                <select
                  value={newCourseComps[comp]}
                  onChange={(e) => handleNewCourseCompChange(comp, e.target.value)}
                >
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </div>
            ))}
          </div>
          {addMessage && <p className={addError ? 'error' : 'success'}>{addMessage}</p>}
          <button type="submit" className="btn">Add Course</button>
        </form>
      </div>

      {/* Update Course Form */}
      <div className="form-section">
        <h3>Update an Existing Course</h3>
        <div className="field">
          <label>Select Course to Update:</label>
          <select value={updateSelectedId} onChange={(e) => handleSelectUpdateCourse(e.target.value)}>
            <option value="">-- Select a course --</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.id}
              </option>
            ))}
          </select>
        </div>
        {updateSelectedId && (
          <form onSubmit={handleUpdateCourse}>
            <div className="fields-grid">
              {competencies.map((comp) => (
                <div className="field" key={comp}>
                  <label>{comp}:</label>
                  <select
                    value={updateComps[comp]}
                    onChange={(e) => handleUpdateCompChange(comp, e.target.value)}
                  >
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                </div>
              ))}
            </div>
            {updateMessage && <p className={updateError ? 'error' : 'success'}>{updateMessage}</p>}
            <button type="submit" className="btn">Update Course</button>
          </form>
        )}
      </div>

      {/* Delete Course Form */}
      <div className="form-section">
        <h3>Delete a Course</h3>
        <form onSubmit={handleDeleteCourse}>
          <div className="field">
            <label>Select Course to Delete:</label>
            <select value={deleteSelectedId} onChange={(e) => setDeleteSelectedId(e.target.value)}>
              <option value="">-- Select a course --</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.id}
                </option>
              ))}
            </select>
          </div>
          {deleteMessage && <p className={deleteError ? 'error' : 'success'}>{deleteMessage}</p>}
          <button type="submit" className="btn btn-delete">Delete Course</button>
        </form>
      </div>
    </div>
  );
}

export default AdminPanel;
