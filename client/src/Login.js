import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import './login.css';

function Login({ setLoggedInUser }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/login', formData);
      const { token } = response.data;
      // Save token to local storage
      localStorage.setItem('token', token);
      // Set logged in user
      setLoggedInUser(formData.username);
    } catch (error) {
      console.error(error); // Handle error
      setError('Invalid credentials. Please try again.'); // Set error message
    }
  };

  return (
    <div className='signup-page'>
<form className="signup-form" onSubmit={handleSubmit}>
<img src="https://socialconnect.id/images/logo-2.png" alt="SocialConnect Logo" className="logo-image" />
<div className="input-wrapper">

        <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" />
        </div>
        <div className="input-wrapper">

        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" />
        </div>
        <div className="input-wrapper">

        <button type="submit">Login</button>
        </div>
      </form>
      {error && <p className="error-message">{error}</p>} {/* Display error message */}
    </div>
  );
}

export default Login;
