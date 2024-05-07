import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import './login.css';

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    age: '',
    password: ''
  });
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [ageError, setAgeError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    setUsernameError('');
    setPasswordError('');
    setAgeError('');

    try {
      const response = await axios.post('http://localhost:3001/signup', formData);
      console.log(response.data); // Handle success
    } catch (error) {
      console.error(error); // Handle error
      const { data } = error.response;
      if (data.username) {
        setUsernameError(data.username);
      }
      if (data.password) {
        setPasswordError(data.password);
      }
      if (data.age) {
        setAgeError(data.age);
      }
    }
  };

  return (
    <div className='signup-page'>
    <form className="signup-form" onSubmit={handleSubmit}>
    <img src="https://socialconnect.id/images/logo-2.png" alt="SocialConnect Logo" className="logo-image" />

      <div className="input-wrapper">
        <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" />
        {usernameError && <p className="error-message">{usernameError}</p>}
      </div>
      <div className="input-wrapper">
        <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Age" />
        {ageError && <p className="error-message">{ageError}</p>}
      </div>
      <div className="input-wrapper">
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" />
        {passwordError && <p className="error-message">{passwordError}</p>}
      </div>
      <button className='logo-image' type="submit">Sign Up</button>
    </form>
  </div>
  
  );
}

export default Signup;
