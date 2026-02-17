import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Only configure Google Strategy if credentials are provided
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
console.log('GOOGLE_CLIENT_SECRET exists:', !!process.env.GOOGLE_CLIENT_SECRET);

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET &&
    !process.env.GOOGLE_CLIENT_ID.includes('your_google_client_id')) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });

          if (!user) {
            user = new User({
              googleId: profile.id,
              email: profile.emails[0].value,
              displayName: profile.displayName,
              photo: profile.photos[0]?.value,
            });
            await user.save();
          }

          done(null, user);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
} else {
  console.warn('⚠️  Google OAuth credentials not configured. Authentication will not work.');
  console.warn('   Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file');
}

export default passport;
