// App.js
import React, { useState } from 'react';
import Signup from './Signup';
import Login from './Login';
import Homepage from './HomePage';


function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [showSignup, setShowSignup] = useState(true);

  const handleToggleForm = () => {
    setShowSignup(prevState => !prevState);
  };

  return (
    
    <div>
      {loggedInUser ? (
        <Homepage username={loggedInUser} />
      ) : showSignup ? (
        <>
          <Signup />
          <p>Already have an account? <button onClick={handleToggleForm}>Go to login</button></p>
        </>
      ) : (
        <>
          <Login setLoggedInUser={setLoggedInUser} />
          <p>Don't have an account? <button onClick={handleToggleForm}>Go to signup</button></p>
        </>
      )}
    </div>
  );
}

export default App;
