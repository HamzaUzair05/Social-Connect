import React, { useState } from 'react';
import './AuthPage.css';
import Axios from 'axios';

const AuthPage = ({ setIsLoggedIn }) => { // Remove setUsername from the function parameters
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(false); // Initially show login form

  const handleSignUp = async () => {
    try {
      // Make a POST request to your backend endpoint to handle user signup
      const response = await Axios.post('http://localhost:3001/signup', {
        username,
        password,
        age,
      });
      console.log(response.data);
      // Navigate to login side
      setIsLogin(true);
      setIsLoggedIn(true); // Inform parent component that user is logged in
    } catch (error) {
      console.error('Signup error:', error);
      setError('An error occurred during signup');
    }
  };
  
  const handleLogin = async () => {
    try {
      // Make POST request to login endpoint
      const response = await Axios.post('http://localhost:3001/login', {
        username,
        password,
      });
  
      // Store user ID in session storage
      sessionStorage.setItem('userId', response.data.userId);
      
      // Inform parent component that user is logged in and pass the username
      setIsLoggedIn(true);
      setUsername(username);
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid username or password');
    }
  };
  
  

  return (
    <div className="auth-container">
      <h2 className="form-heading">{isLogin ? 'Login' : 'Sign Up'}</h2>
      {error && <p className="error-message">{error}</p>}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="input-field"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input-field"
      />
      {!isLogin && (
        <>
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input-field"
          />
          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="input-field"
          />
        </>
      )}
      <button onClick={isLogin ? handleLogin : handleSignUp} className="action-button">
        {isLogin ? 'Login' : 'Sign Up'}
      </button>
      <p onClick={() => setIsLogin(!isLogin)} className="toggle-message">
        {isLogin ? 'Don\'t have an account? Sign Up' : 'Already have an account? Login'}
      </p>
    </div>
  );
};

export default AuthPage;
