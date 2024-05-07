// SendFriendRequest.js
import React, { useState } from 'react';
import axios from 'axios';

function SendFriendRequest({ username }) {
  const [receiverUsername, setReceiverUsername] = useState('');
  const [error, setError] = useState(null);

  const handleSendRequest = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/friendRequests/send', {
        senderUsername: username,
        receiverUsername: receiverUsername
      });
      console.log(response.data.message);
      setReceiverUsername('');
      setError(null);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <div className="friend-request">
      <h2>Send Friend Request</h2>
      <form onSubmit={handleSendRequest}>
        <input type="text" value={receiverUsername} onChange={(e) => setReceiverUsername(e.target.value)} placeholder="Enter receiver's username" />
        <button type="submit">Send Request</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}

export default SendFriendRequest;
