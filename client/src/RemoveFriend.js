import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

function RemoveFriend({ username }) {
  const [friends, setFriends] = useState([]);

  const fetchFriends = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:3001/friends/${username}`);
      setFriends(response.data);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  }, [username]);

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  const removeFriend = async (friendUsername) => {
    try {
      await axios.post('http://localhost:3001/friends/remove', { username, friendUsername });
      console.log('Friend removed successfully');
      fetchFriends(); // Refresh friends after removing friend
    } catch (error) {
      console.error('Error removing friend:', error);
    }
  };

  return (
    <div className="remove-friend">
      <h3>Remove Friend</h3>
      <ul>
        {friends.map((friend) => (
          <li key={friend}>
            {friend} 
            <button onClick={() => removeFriend(friend)}>Remove</button>
            {/* Link to profile */}
            <Link to={`/profile/${friend}`}>Visit Profile</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RemoveFriend;
