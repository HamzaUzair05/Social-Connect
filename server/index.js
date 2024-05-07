require('dotenv').config();
const jwt = require('jsonwebtoken');
const express = require("express");
const app = express();
const session = require('express-session');
const mongoose = require('mongoose');
const UserModel = require('./models/users');
const FriendRequestModel = require('./models/friendRequests');
const MessageModel = require('./models/messages');
const PostModel = require('./models/posts');
const ProductModel = require('./models/products')
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const MongoStore = require('connect-mongo');

// Use JSON middleware
app.use(express.json());
// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

const multer = require('multer');

// Configure multer to handle file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/') // Specify the directory where uploaded files should be stored
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname) // Generate unique file names
    }
  });
  
  const upload = multer({ storage: storage });

/*
// Generate a secure random secret using Node.js's crypto module
const crypto = require('crypto');

const generateSecret = () => {
  return crypto.randomBytes(32).toString('hex');
};
*/

// Configure CORS to allow requests from the client origin with credentials
app.use(cors({
    origin: 'http://localhost:3000', // Replace with your client origin
    credentials: true,
  }));
/*
app.use(session({
    secret: generateSecret(),
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ 
      mongoUrl: 'mongodb+srv://hamzauzair15:hamab034@cluster0.ezfelm2.mongodb.net/SocialConnect?retryWrites=true&w=majority&appName=Cluster0', // Replace with your MongoDB connection URL
      ttl: 14 * 24 * 60 * 60, // Session TTL (optional)
    }),
  }));
  */
app.use(cors())

mongoose.connect('mongodb+srv://hamzauzair15:hamab034@cluster0.ezfelm2.mongodb.net/SocialConnect?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });


/*
// Initialize Passport and session middleware
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport with local strategy
passport.use(new LocalStrategy(
    async function(username, password, done) {
      try {
        // Find user by username and password
        const user = await UserModel.findOne({ username, password });
        if (!user) {
          return done(null, false, { message: 'Incorrect username or password' });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));
// Serialize user for session
passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  // Deserialize user from session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await UserModel.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
*/
// Your existing routes here...

// GET route to fetch all users
app.get("/getUsers", async (req, res) => {
    try {
        const users = await UserModel.find({});
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST route to create a new user
app.post("/createUser", async (req,res) => {
    const user = req.body;
    try {
        const newUser = new UserModel(user);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Signup route
// Signup route
app.post('/signup', async (req, res) => {
  try {
    const { username, age, password } = req.body;

    // Check if username already exists
    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ username: 'Username already exists' });
    }

    // Check if password includes a number
    if (!/\d/.test(password)) {
      return res.status(400).json({ password: 'Password must include at least one number' });
    }

    // Check if age is less than 8
    if (age < 8) {
      return res.status(400).json({ age: 'Age must be at least 8' });
    }

    // Create new user
    const user = new UserModel({ username, age, password });
    await user.save();
    
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create user' });
  }
});

  
  // Login route
  app.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await UserModel.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (password !== user.password) {
        return res.status(401).json({ message: 'Invalid password' });
      }
      // Generate JWT token
      const secretKey = process.env.SECRET_KEY;
      if (!secretKey) {
        console.error('Secret key not found. Please set the SECRET_KEY environment variable.');
        return res.status(500).json({ message: 'Internal server error' });
      }
      const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });
      res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Login failed' });
    }
  });
  
/*
// POST route to handle user signup
app.post("/signup", async (req, res) => {
    const { username, password, age } = req.body;
    try {
        // Check if user already exists
        const existingUser = await UserModel.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        // Create new user
        const newUser = new UserModel({ username, password, age });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Add authentication middleware
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'Unauthorized' });
}


app.post("/login", passport.authenticate('local'), (req, res) => {
    // If authentication succeeds, user is available in req.user
    const userId = req.user._id;
    
    // Store user ID in session
    req.session.userId = userId;
    
    // Respond with success message
    res.status(200).json({ message: 'Login successful', userId });
  });
  */
  
  // GET route to fetch user ID from session
// GET route to fetch user ID from username
app.get("/getUserId", async (req, res) => {
    const { username } = req.query;
  
    try {
      // Find user by username
      const user = await UserModel.findOne({ username });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const userId = user._id;
      res.status(200).json({ userId });
    } catch (error) {
      console.error('Error fetching user ID:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  


// Routes for friend requests
// Send a friend request
app.post("/friendRequests/send", async (req, res) => {
    const { senderUsername, receiverUsername } = req.body;

    try {
        // Find the sender and receiver by their usernames
        const sender = await UserModel.findOne({ username: senderUsername });
        const receiver = await UserModel.findOne({ username: receiverUsername });

        // Check if sender and receiver exist
        if (!sender || !receiver) {
            return res.status(404).json({ message: 'Sender or receiver not found' });
        }

        // Check if the sender has already sent a request to the receiver
        const existingRequest = await FriendRequestModel.findOne({ senderUsername, receiverUsername });
        if (existingRequest) {
            return res.status(400).json({ message: 'Friend request already sent' });
        }

       // Create and save the friend request
const newRequest = new FriendRequestModel({ senderUsername: sender.username, receiverUsername: receiver.username });
await newRequest.save();


        res.status(201).json({ message: 'Friend request sent successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// POST endpoint to accept a friend request
app.post('/friendRequests/accept', async (req, res) => {
    const { senderUsername } = req.body;

    try {
        // Find the friend request by sender username
        const request = await FriendRequestModel.findOne({ senderUsername, status: 'pending' });
        if (!request) {
            return res.status(404).json({ message: 'Pending friend request not found for the specified sender' });
        }

        // Extract the receiver's username from the friend request
        const receiverUsername = request.receiverUsername;

        // Update the request status to accepted
        request.status = 'accepted';
        await request.save();

        // Add sender and receiver as friends in the UserModel
        const sender = await UserModel.findOne({ username: senderUsername });
        const receiver = await UserModel.findOne({ username: receiverUsername });

        if (!sender || !receiver) {
            return res.status(404).json({ message: 'Sender or receiver not found' });
        }

        sender.friends.push(receiver._id);
        receiver.friends.push(sender._id);

        await sender.save();
        await receiver.save();

        res.status(200).json({ message: 'Friend request accepted successfully' });
    } catch (error) {
        console.error('Error accepting friend request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// GET endpoint to fetch sender usernames of pending friend requests
app.get('/friendRequests/pending/:username', async (req, res) => {
    const { username } = req.params;

    try {
        // Find all pending friend requests for the specified username
        const pendingRequests = await FriendRequestModel.find({ receiverUsername: username, status: 'pending' });

        // Extract the usernames of senders from the pending requests
        const senderUsernames = pendingRequests.map(request => request.senderUsername);

        // Return the sender usernames as a JSON response
        res.status(200).json(senderUsernames);
    } catch (error) {
        // Handle any errors
        console.error('Error fetching pending friend requests:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get pending friend requests for a certain username
app.get("/friendRequests/pending/:username", async (req, res) => {
    const { username } = req.params;

    try {
        // Find pending friend requests for the provided username
        const pendingRequests = await FriendRequestModel.find({ receiverUsername: username, status: 'pending' })
            .populate('sender', 'username'); // Populate sender's username from User collection

        res.status(200).json({ pendingRequests });
    } catch (error) {
        console.error('Error fetching pending friend requests:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



// Fetch a user's friends
app.get("/friendRequests/friends/:userId", async (req, res) => {
    const userId = req.params.userId;
    try {
        // Find the user by ID and populate the 'friends' field
        const user = await UserModel.findById(userId).populate('friends');
        res.status(200).json(user.friends);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Remove friend endpoint
app.post("/friends/remove", async (req, res) => {
    const { username, friendUsername } = req.body;

    try {
        // Find the user document corresponding to the friendUsername
        const friendUser = await UserModel.findOne({ username: friendUsername });
        const thisUser = await UserModel.findOne({ username: username });

        if (!friendUser) {
            return res.status(404).json({ message: 'Friend not found' });
        }
        
        const friendId = friendUser._id;
        const thisUserId = this._id;

        // Remove friend from user's friend list (using friend's ObjectId)
        await UserModel.updateOne({ username }, { $pull: { friends: friendId } });
        
        // Remove user from friend's friend list (using user's username)
        await UserModel.updateOne({ username: friendUsername }, { $pull: { friends: thisUserId } });

        res.status(200).json({ message: 'Friend removed successfully' });
    } catch (error) {
        console.error('Error removing friend:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// GET endpoint to fetch a user's friends (only usernames)
app.get("/friends/:username", async (req, res) => {
    const { username } = req.params;

    try {
        // Find the user by username
        const user = await UserModel.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch the user's friends (with projection to include only the username field)
        const friends = await UserModel.find(
            { _id: { $in: user.friends } }, // Filter by user's friend IDs
            { username: 1 } // Projection to include only the username field
        );

        // Extract usernames from the friend objects
        const friendUsernames = friends.map(friend => friend.username);

        res.status(200).json(friendUsernames);
    } catch (error) {
        console.error('Error fetching user friends:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// POST endpoint to send a message
app.post("/messages/send", async (req, res) => {
    const { sender, recipient, content } = req.body;

    try {
        // Create and save the message
        const newMessage = new MessageModel({
            sender: sender,
            recipient: recipient,
            content: content
        });
        await newMessage.save();
        
        // Update the user's posts field
        const usersender = await UserModel.findOne({ username: sender });
        if (!usersender) {
            return res.status(404).json({ message: 'User not found' });
        }
        usersender.messages.push(newMessage._id);
        await usersender.save();

        // Update the user's posts field
        const userrecv = await UserModel.findOne({ username: recipient });
        if (!userrecv) {
            return res.status(404).json({ message: 'User not found' });
        }
        userrecv.messages.push(newMessage._id);
        await userrecv.save();

        res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET endpoint to fetch messages between two users
app.get("/messages/:sender/:recipient", async (req, res) => {
    const { sender, recipient } = req.params;

    try {
        // Fetch messages between sender and recipient, select sender, recipient, and content fields
        const messages = await MessageModel.find({
            $or: [
                { sender: sender, recipient: recipient },
                { sender: recipient, recipient: sender }
            ]
        }).select({ sender: 1, recipient: 1, content: 1, _id: 0 }).sort({ createdAt: 1 }); // Sort by createdAt ascending order

        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// POST endpoint to delete chat between two users
app.post("/messages/delete", async (req, res) => {
    const { username, friend } = req.body;

    try {
        // Find messages between the sender and friend
        const messagesToRemove = await MessageModel.find({
            $or: [
                { sender: username, recipient: friend },
                { sender: friend, recipient: username }
            ]
        }).select('_id');
        
        // Extract the IDs of messages to be removed
        const messageIds = messagesToRemove.map(message => message._id);
        
        // Remove message IDs from user's message list (using user's username)
        await UserModel.updateOne({ username }, { $pull: { messages: { $in: messageIds } } });
        
        // Remove message IDs from friend's message list (using friend's username)
        await UserModel.updateOne({ username: friend }, { $pull: { messages: { $in: messageIds } } });

        // Delete messages between the sender and friend
        await MessageModel.deleteMany({
            $or: [
                { sender: username, recipient: friend },
                { sender: friend, recipient: username }
            ]
        });
        
        res.status(200).json({ message: 'Chat deleted successfully' });
    } catch (error) {
        console.error('Error deleting chat:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// POST endpoint to create a new post with file upload
app.post("/posts/create", upload.single('image'), async (req, res) => {
    const { author, content, tags, privacy } = req.body;
    const image = req.file ? req.file.path.replace(/\\/g, '/') : null; // Check if a file was uploaded and get its path
    
    try {
      // Create and save the post
      const newPost = new PostModel({
        author: author,
        content: content,
        tags: tags || [],
        privacy: privacy,
        image: image // Save the file path in the database
      });
      await newPost.save();
  
      // Update the user's posts field
      const user = await UserModel.findOne({ username: author });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      user.posts.push(newPost._id);
      await user.save();
  
      res.status(200).json({ message: 'Post created successfully' });
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

// Endpoint for adding comments to a post
app.post('/posts/:postId/comments', async (req, res) => {
  const postId = req.params.postId;
  const { username, content } = req.body;

  try {
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Ensure the comments array exists before pushing a new comment
    post.comments = post.comments || [];
    post.comments.push({ username, content });
    await post.save();

    res.status(200).json({ message: 'Comment added successfully' });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Endpoint for sharing a post
app.post('/posts/:postId/share', async (req, res) => {
  const postId = req.params.postId;
  const { username, privacy } = req.body;

  try {
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    
    // Create a new post with the shared data
    const newPost = new PostModel({
      author: post.author,
      content: post.content,
      tags: post.tags,
      privacy: privacy,
      image: post.image,
      sharedBy: username // Assign the current user as the author of the new post
      // Add other fields as needed
    });
    await newPost.save();

    res.status(200).json({ message: 'Post shared successfully' });
  } catch (error) {
    console.error('Error sharing post:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.post('/posts/:postId/like', async (req, res) => {
  const postId = req.params.postId;
  const { username } = req.body;

  try {
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the user has already liked the post
    const existingLike = post.likes.find(like => like.username === username);
    if (existingLike) {
      return res.status(400).json({ message: 'Post already liked' }); // Send message if post already liked
    } else {
      // Add the user to the likes array and increment the count
      post.likes.push({ username, count: 1 });
      await post.save();
      res.status(200).json({ message: 'Post liked successfully' });
    }
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


/*
// POST endpoint to create a new post
app.post("/posts/create", async (req, res) => {
    const { author, content, tags,privacy } = req.body;

    try {
        // Create and save the post
        const newPost = new PostModel({
            author: author,
            content: content,
            tags: tags || [], // Set tags to an empty array if not provided
            privacy : privacy  
        });
        await newPost.save();

        // Update the user's posts field
        const user = await UserModel.findOne({ username: author });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.posts.push(newPost._id);
        await user.save();

        res.status(200).json({ message: 'Post created successfully' });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
*/

// GET endpoint to fetch all posts
app.get("/posts", async (req, res) => {
    try {
        // Fetch all posts
        const posts = await PostModel.find();
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Express route handler to add interests for a user
app.post('/user/:username/interests', async (req, res) => {
    const { username } = req.params;
    const { interest } = req.body;
  
    try {
      // Find the user by username
      const user = await UserModel.findOne({ username });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Add the interest to the user's interests array
      user.interests.push(interest);
  
      // Save the updated user document
      await user.save();
  
      res.status(201).json({ message: 'Interest added successfully', interests: user.interests });
    } catch (error) {
      console.error('Error adding interest:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Express route handler to get a user's interests
app.get('/user/:username/interests', async (req, res) => {
    const { username } = req.params;
  
    try {
      // Find the user by username
      const user = await UserModel.findOne({ username });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Return the user's interests
      res.status(200).json({ interests: user.interests });
    } catch (error) {
      console.error('Error fetching user interests:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
app.get("/posts/:userId", async (req, res) => {
    // Implement logic to fetch posts by a user
});

app.get("/posts/all", async (req, res) => {
    // Implement logic to fetch all posts
});


app.listen(3001, () => {
    console.log("SERVER RUNS PERFECTLY!");
});


/*const express = require("express");
const app = express();
const mongoose = require('mongoose');
const UserModel = require('./models/users')
const cors = require('cors')

app.use(express.json())
app.use(cors())

mongoose.connect("mongodb+srv://hamzauzair15:hamab034@cluster0.ezfelm2.mongodb.net/SocialConnect?retryWrites=true&w=majority&appName=Cluster0");

app.get("/getUsers", (req, res) => {
    UserModel.find({})
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            res.json(err);
        });
});

app.post("/createUser", async (req,res)=>{
    const user = req.body
    const newUser = new UserModel(user)
    await newUser.save();

    res.json(user)
})

app.listen(3001, () => {
    console.log("SERVER RUNS PERFECTLY!");
});
*/