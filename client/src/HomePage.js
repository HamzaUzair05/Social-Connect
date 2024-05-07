// Homepage.js

import React, { useState } from 'react';
import Friends from './Friends';
import Feed from './Feed';
import Messages from './Messages';
import './HomePage.css';

function Homepage({ username }) {
  const [loggedin, setLoggedin] = useState(true);
  const handleSignout = () => {
    // Perform any necessary signout logic here
    setLoggedin(false);
    // Refresh the page
    window.location.reload();
  };
  

  return (
    <div>
    {/* Header */}
<div className="header">
<span className="header-title">Welcome to SocialConnect</span>

  {loggedin && <button className='signout-button' onClick={handleSignout}>Sign Out</button>}
</div>


      {/* Main content */}
      <div className="home-container">
        <div className="friends">
          <div className="wow">
            <Friends username={username} />
          </div>
        </div>
        <div className="feed">
          <div className="wow">
            <Feed username={username} />
          </div>
        </div>
        <div className="messages">
          <div className="wow">
            <Messages username={username} />
          </div>
        </div>
      </div>
      
       {/* Footer */}
      <div className="footer">&copy; 2024 SocialConnect. All rights reserved.</div>
    </div>
  );
}

export default Homepage;
