// jwtAuthMiddleware.js

const jwt = require('jsonwebtoken');

// Middleware function to authenticate JWT token
function jwtAuthMiddleware(req, res, next) {
  // Get the JWT token from the request headers
  const token = req.headers.authorization;

  // Check if the token is missing
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Missing token' });
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, 'your-secret-key');

    // Extract the user ID from the decoded token
    req.userId = decoded.userId;

    // Proceed to the next middleware
    next();
  } catch (error) {
    // Return an error if the token is invalid
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
}

module.exports = jwtAuthMiddleware;
