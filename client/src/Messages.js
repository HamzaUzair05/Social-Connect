import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import "./messages.css"

function Messages({ username }) {
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState('');
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState('');

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


  const handleFriendSelection = (friend) => {
    // If the selected friend is already the same as the clicked friend, clear the selectedFriend state
    if (friend === selectedFriend) {
      setSelectedFriend('');
    } else {
      setSelectedFriend(friend);
      // Fetch messages between the sender and selected friend
      fetchMessages(username, friend);
    }
  };
  
  const fetchMessages = async (sender, recipient) => {
    try {
      const response = await axios.get(`http://localhost:3001/messages/${sender}/${recipient}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (content) => {
    try {
      await axios.post('http://localhost:3001/messages/send', {
        sender: username,
        recipient: selectedFriend,
        content: content
      });
      // Refresh messages after sending message
      fetchMessages(username, selectedFriend);
      setMessageContent('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const deleteChat = async () => {
    try {
      await axios.post(`http://localhost:3001/messages/delete`, {
        username: username,
        friend: selectedFriend
      });
      // Clear messages after deleting chat
      setMessages([]);
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  return (
    <div className="messages-container">
      
    <div className="messages">
      <h2>Messages</h2>
      <div>
        <h3>Select a friend to chat with:</h3>
        <ul>
          {friends.map((friend) => (
            <li key={friend} onClick={() => handleFriendSelection(friend)}>{friend}</li>
          ))}
        </ul>
      </div>
      {selectedFriend && (
        <div className='chat-container'>
          <h3>Chat with {selectedFriend}:</h3>
          <ul className="message-list">
  {messages.map((message, index) => (
    <li key={index} className={message.sender === username ? "sent" : "received"}>
      <div className={message.sender === username ? "sent-message" : "received-message"}>
        {message.content}
      </div>
    </li>
  ))}
</ul>


          <input type="text" placeholder="Type your message..." value={messageContent} onChange={(e) => setMessageContent(e.target.value)} />
          <button onClick={() => sendMessage(messageContent)}>Send</button>
          <button onClick={deleteChat}>Delete Chat</button>
            </div>
      )}
    </div>
    </div>
  );
}

export default Messages;
