import { useState } from 'react';
import './App.css';

// Components
import Login from './components/Login'
import Main from './components/Main'


// Context
import { AuthContext } from './context/AuthContext';

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [currentUser, setCurrentUser] = useState('user1@example.com')

  const handleSuccessLogin = function (user) {
    setIsAuthenticated(true)
    setCurrentUser(user)
  }

  const handleLogout = function () {
    setCurrentUser(null)
    setIsAuthenticated(false)
  }


  return (
    <AuthContext.Provider value={{currentUser}}>
      {isAuthenticated ? <Main onLogout={handleLogout} /> : <Login onLogin={handleSuccessLogin} />}
    </AuthContext.Provider>
    // <Login />
    // <Reservation />
  );
}

export default App;
