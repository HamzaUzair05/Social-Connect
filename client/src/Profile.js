import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams hook

function Profile() {
  const { username } = useParams(); // Extract the username from the route parameters

  // Use the username in your component
  return (
    <div>
      <h2>User Profile: {username}</h2>
      {/* Display other user information as needed */}
    </div>
  );
}

export default Profile;
