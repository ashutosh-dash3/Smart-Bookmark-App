import express from 'express';
import Bookmark from '../models/Bookmark.js';

const router = express.Router();

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
};

router.get('/', isAuthenticated, async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(bookmarks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookmarks' });
  }
});

router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { title, url } = req.body;
    
    if (!title || !url) {
      return res.status(400).json({ error: 'Title and URL are required' });
    }

    const bookmark = new Bookmark({
      userId: req.user._id,
      title,
      url
    });

    await bookmark.save();

    const io = req.app.get('io');
    io.to(req.user._id.toString()).emit('bookmark:created', bookmark);

    res.status(201).json(bookmark);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create bookmark' });
  }
});

router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const bookmark = await Bookmark.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }

    const io = req.app.get('io');
    io.to(req.user._id.toString()).emit('bookmark:deleted', { id: req.params.id });

    res.json({ message: 'Bookmark deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete bookmark' });
  }
});

export default router;
