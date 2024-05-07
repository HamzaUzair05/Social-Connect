import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './feed.css'; // Import CSS file for styling

function Feed({ username }) {
  const [postContent, setPostContent] = useState('');
  const [tags, setTags] = useState('');
  const [privacy, setPrivacy] = useState('public');
  const [interest, setInterest] = useState('');
  const [image, setImage] = useState(null); // New state for image
  const [posts, setPosts] = useState([]);
  const [friends, setFriends] = useState([]);
  const [userInterests, setUserInterests] = useState([]);

  // Function to fetch posts
  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchFriends = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:3001/friends/${username}`);
      setFriends(response.data);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  }, [username]);

  const fetchInterests = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:3001/user/${username}/interests`);
      setUserInterests(response.data.interests);
    } catch (error) {
      console.error('Error fetching user interests:', error);
    }
  }, [username]);
  
  useEffect(() => {
    fetchPosts();
    fetchFriends();
    fetchInterests();
  }, [fetchFriends, fetchInterests]);

  // Function to handle post submit
  const handlePostSubmit = async () => {
    try {
      const formData = new FormData(); // Create FormData object
      formData.append('author', username);
      formData.append('content', postContent);
      formData.append('tags', tags.split(',').map(tag => tag.trim()));
      formData.append('privacy', privacy);
      formData.append('image', image); // Append image file to FormData
      
      await axios.post('http://localhost:3001/posts/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data' // Set content type to multipart/form-data for file upload
        }
      });

      setPostContent('');
      setTags('');
      setImage(null); // Reset image state
      fetchPosts();
    } catch (error) {
      console.error('Error submitting post:', error);
    }
  };

  // Function to handle interest submit
  const handleInterestSubmit = async () => {
    try {
      await axios.post(`http://localhost:3001/user/${username}/interests`, {
        interest,
      });
      setInterest('');
      fetchInterests();
    } catch (error) {
      console.error('Error submitting interest:', error);
    }
  };

  // Function to handle post like
  const handleLike = async (postId) => {
    try {
      // Send a request to the server to like the post
      await axios.post(`http://localhost:3001/posts/${postId}/like`, { username });
      // Fetch posts again to update the like count
      fetchPosts();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  // Function to handle post share
  const handleShare = async (postId) => {
    try {
      // Send a request to the server to share the post
      await axios.post(`http://localhost:3001/posts/${postId}/share`, { username, privacy });
      // Fetch posts again to update the shared post
      fetchPosts();
    } catch (error) {
      console.error('Error sharing post:', error);
    }
  };

  // Function to handle commenting
  const handleComment = async (postId) => {
    const commentContent = prompt('Add a comment:');
    if (commentContent !== null) {
      try {
        // Send a request to the server to add a comment to the post
        await axios.post(`http://localhost:3001/posts/${postId}/comments`, { username, content: commentContent });
        // Fetch posts again to update the comments
        fetchPosts();
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  };

  const filterPosts = (posts) => {
    return posts.filter(post => {
      const matchingInterests = post.tags.filter(tag => userInterests.includes(tag));
      return (post.privacy === 'public' && matchingInterests.length > 0) || post.author === username || friends.includes(post.author);
    }).map(post => {
      // Modify the post if it has been shared
      if (post.sharedBy && post.sharedBy !== '') {
        return {
          ...post,
        //  content: `${post.sharedBy} shared a post of ${post.author}: ${post.content}`
        };
      }
      return post;
    });
  };
  

  return (
    <div className="feed-container">
      {/* Interests section */}
      <div className="component">
      <div className="interests-section">
        <h3>HOME</h3>
        <h4>Add Interests To Get Started (eg: cricket,technology)</h4>
        <ul>
          {userInterests.map((interest, index) => (
            <li key={index}>{interest}</li>
          ))}
        </ul>
        <div className="add-interest">
          <input
            type="text"
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            placeholder="Add interest"
          />
          <button className='interest-button' onClick={handleInterestSubmit}>Add</button>
        </div>
      </div>
      </div>
      
      {/* Post input section */}
      <div className="component">
        <div className="post-input-section">
          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="What's on your mind?"
            rows={4}
            cols={50}
          ></textarea>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (comma-separated)"
          />
          <div className="input-container">
            <input
              type="file" // Input type for file upload
              onChange={(e) => setImage(e.target.files[0])} // Set the selected image file to the state
              id="file-input"
            />
            
            <label htmlFor="file-input" className="upload-button">
            <span className="upload-text">Choose Photo</span>
            <img src="https://t4.ftcdn.net/jpg/04/81/13/43/360_F_481134373_0W4kg2yKeBRHNEklk4F9UXtGHdub3tYk.jpg" alt="Upload" className="upload-icon" /> {/* Use the link of the icon */}
            </label>

          </div>
          <select value={privacy} onChange={(e) => setPrivacy(e.target.value)}>
            <option value="public">Public</option>
            <option value="friends">Friends</option>
          </select>
          <button onClick={handlePostSubmit}>Post</button>
        </div>
      </div>
      {/* Display filtered posts */}
      <div className="post-list">
        <h3>Feed</h3>
        {filterPosts(posts).reverse().map((post) => (
          <div key={post._id} className="post">
            {/* Display the post content with appropriate message if shared */}
            <p className='author-name'>
              {post.sharedBy && post.sharedBy !== '' ? `${post.sharedBy} shared a post of ${post.author}: ` : `${post.author}: `}
            </p>
            <p>{post.content}</p>
            {/* Display image if available */}
            {post.image && <img src={`http://localhost:3001/${post.image}`} alt="Post" className="post-image" />}
            {/* Display number of likes if likes array exists */}
            <p>Likes: {post.likes ? post.likes.length : 0}</p>
            {/* Like button */}
            <button className="like-button" onClick={() => handleLike(post._id)}>Like</button>
            <select className="share-dropdown" onChange={(e) => setPrivacy(e.target.value)}>
              <option value="public">Share Publicly</option>
              <option value="friends">Share with Friends</option>
            </select>
            <button className="share-button" onClick={() => handleShare(post._id)}>Share</button>
            <button className="comment-button" onClick={() => handleComment(post._id)}>Comment</button>

            {/* Display comments if comments array exists */}
            <div className="comments">
              <h4>Comments</h4>
              {post.comments && post.comments.map((comment, index) => (
                <p key={index}>{comment.username}: {comment.content}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Feed;
