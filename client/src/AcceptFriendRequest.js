// AcceptFriendRequest.js
import React from 'react';
import axios from 'axios';

function AcceptFriendRequest({ pendingRequests, onAcceptRequest }) {
  const handleAccept = async (requestId) => {
    try {
      const response = await axios.post('http://localhost:3001/friendRequests/accept', { requestId });
      console.log(response.data.message);
      onAcceptRequest(requestId);
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  return (
    <div className="friend-request">
      <h2>Pending Friend Requests</h2>
      <select onChange={(e) => handleAccept(e.target.value)}>
        <option value="">Select request to accept</option>
        {pendingRequests.map(request => (
          <option key={request._id} value={request._id}>{request.sender.username}</option>
        ))}
      </select>
    </div>
  );
}

export default AcceptFriendRequest;
