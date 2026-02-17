import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

/**
 * Passport Configuration
 * 
 * This module configures Google OAuth authentication.
 * Environment variables are validated in server.js before this module loads.
 */

// Serialize user ID to session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Configure Google OAuth Strategy
const configureGoogleStrategy = () => {
  // Determine callback URL based on environment
  const callbackURL = process.env.NODE_ENV === 'production'
    ? `${process.env.SERVER_URL || process.env.RENDER_EXTERNAL_URL}/api/auth/google/callback`
    : 'http://localhost:5000/api/auth/google/callback';

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: callbackURL,
        proxy: true // Trust proxy for HTTPS
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Find or create user
          let user = await User.findOne({ googleId: profile.id });

          if (!user) {
            user = new User({
              googleId: profile.id,
              email: profile.emails?.[0]?.value,
              displayName: profile.displayName,
              photo: profile.photos?.[0]?.value,
            });
            await user.save();
          }

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
};

// Initialize strategy if credentials are available
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  configureGoogleStrategy();
}

export default passport;
