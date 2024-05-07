import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PendingRequests = ({ username }) => {
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        // Make a GET request to fetch pending friend requests for the specified username
        const response = await axios.get(`http://localhost:3001/friendRequests/pending/${username}`);

        // Update the state with the sender usernames from the response
        setPendingRequests(response.data);
      } catch (error) {
        console.error('Error fetching pending friend requests:', error);
      }
    };

    // Fetch pending requests when the component mounts
    fetchPendingRequests();
  }, [username]);

  const acceptRequest = async (senderUsername) => {
    try {
      // Make a POST request to accept the friend request
      await axios.post('http://localhost:3001/friendRequests/accept', { senderUsername });

      // After accepting the request, update the state to remove the accepted request
      setPendingRequests(pendingRequests.filter(request => request !== senderUsername));
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  return (
    <div>
      <h2>Pending Friend Requests</h2>
      <ul>
        {pendingRequests.map((senderUsername, index) => (
          <li key={index}>
            {senderUsername}
            <button onClick={() => acceptRequest(senderUsername)}>Accept</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PendingRequests;
