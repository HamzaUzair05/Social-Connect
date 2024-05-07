const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const UserModel = require('./models/user'); // Assuming you have a UserModel defined

// Configure the Local Strategy for username/password authentication
passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      // Find the user in the database by username
      const user = await UserModel.findOne({ username });

      // If user not found or password is incorrect, return error
      if (!user || !user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect username or password' });
      }

      // If user found and password is correct, return user object
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

// Serialize user into session
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

module.exports = passport;
