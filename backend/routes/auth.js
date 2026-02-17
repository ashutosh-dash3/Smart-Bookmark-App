import express from 'express';
import passport from 'passport';

const router = express.Router();

const isGoogleConfigured = process.env.GOOGLE_CLIENT_ID && 
  process.env.GOOGLE_CLIENT_SECRET &&
  process.env.GOOGLE_CLIENT_ID !== 'your_google_client_id';

router.get('/google', (req, res, next) => {
  if (!isGoogleConfigured) {
    return res.status(503).json({ 
      error: 'Google OAuth not configured',
      message: 'Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file'
    });
  }
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get('/google/callback', (req, res, next) => {
  if (!isGoogleConfigured) {
    return res.status(503).json({ 
      error: 'Google OAuth not configured' 
    });
  }
  passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL}/login`
  })(req, res, next);
}, (req, res) => {
  res.redirect(process.env.CLIENT_URL);
});

router.get('/me', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      isAuthenticated: true,
      user: {
        id: req.user._id,
        displayName: req.user.displayName,
        email: req.user.email,
        photo: req.user.photo
      }
    });
  } else {
    res.json({ isAuthenticated: false, user: null });
  }
});

router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    req.session.destroy();
    res.json({ message: 'Logged out successfully' });
  });
});

export default router;
