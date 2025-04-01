import { useState } from 'react';
import Dashboard from './components/Dashboard';
import Login from './components/Login';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div>
      <div>
        {!loggedIn ? (
          <Login onLogin={() => setLoggedIn(true)} />
        ) : (
          <div className='logoutContainer'>
            <button className='logoutButton' onClick={() => setLoggedIn(false)}>Logout</button>
          </div>
        )}
      </div>
      <Dashboard isAdmin={loggedIn} />
    </div>
  );
}

export default App;
