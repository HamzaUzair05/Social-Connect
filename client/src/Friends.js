import React from 'react';
import SendFriendRequest from './SendFriendRequest';
import PendingRequests from './PendingRequests';
import RemoveFriend from './RemoveFriend';
import './friends.css'; // Import the CSS file

function Friends({ username }) {
  return (
    <div className="friends-container">
      <p1></p1>
      <h2>Friends</h2>
      <p>Logged in as : {username}</p>
      <div className="component"> {/* Add the component class here */}
        <SendFriendRequest username={username} />
      </div>
      <div className="component"> {/* Add the component class here */}
        <PendingRequests username={username} />
      </div>
      <div className="component"> {/* Add the component class here */}
        <RemoveFriend username={username} />
      </div>
    </div>
  );
}

export default Friends;
