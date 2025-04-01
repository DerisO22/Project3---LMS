import { useState } from 'react';
import Dashboard from './components/Dashboard';
import Login from './components/Login';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div>
      <div style={{ textAlign: 'right', padding: '10px' }}>
        {!loggedIn ? (
          <Login onLogin={() => setLoggedIn(true)} />
        ) : (
          <button onClick={() => setLoggedIn(false)}>Logout</button>
        )}
      </div>
      <Dashboard isAdmin={loggedIn} />
    </div>
  );
}

export default App;
