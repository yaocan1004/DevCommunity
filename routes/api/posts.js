const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Post = require('../../modules/Post');
const Profile = require('../../modules/Profile');
const User = require('../../modules/User');
const { check, validationResult } = require('express-validator');

//@route    POST api/posts
//@desc     Create a post
//@access   Private
router.post(
  '/',
  [
    auth,
    [
      check('text', 'Text should not be empty')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const newPost = new Post({
        user: req.user.id,
        text: req.body.text,
        name: user.name,
        avatar: user.avatar
      });
      const post = await newPost.save();
      res.json(post);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//@route    GET api/posts
//@desc     Get all posts
//@access   Private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server Error');
  }
});

//@route    GET api/posts/:post_id
//@desc     Get post bby post id
//@access   Private
router.get('/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    console.log(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
});

//@route    DELETE api/posts/:post_id
//@desc     Delte posts by id
//@access   Private
router.delete('/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    await post.remove();
    res.json({ msg: 'Post removed' });
  } catch (error) {
    console.log(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
});

//@route    PUT api/posts/like/:post_id
//@desc     Add like to post
//@access   Private
router.put('/like/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      return res.status(400).json({ msg: 'Post already liked' });
    }
    const like = {
      user: req.user.id
    };
    post.likes.unshift(like);
    await post.save();
    res.json(post.likes);
  } catch (error) {
    console.log(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
});

//@route    PUT api/posts/unlike/:post_id
//@desc     Add like to post
//@access   Private
router.put('/unlike/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length ===
      0
    ) {
      return res.status(400).json({ msg: 'Post has not been liked' });
    }

    const removeIndex = post.likes
      .map(like => like.user.toString())
      .indexOf(req.user.id);
    post.likes.splice(removeIndex, 1);
    await post.save();
    res.json(post.likes);
  } catch (error) {
    console.log(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
});

//@route    PUT api/posts/comments/:post_id
//@desc     Comment post
//@access   Private
router.put(
  '/comments/:post_id',
  [
    auth,
    check('text', 'Text should not be empty')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ msg: errors.array() });
    }
    try {
      const post = await Post.findById(req.params.post_id).select('-password');
      if (!post) {
        return res.status(404).json({ msg: 'Post not found' });
      }
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ msg: 'User of post not found' });
      }
      const newCom = {
        user: req.user.id,
        text: req.body.text,
        name: user.name,
        avatar: user.avatar
      };
      post.comments.unshift(newCom);
      await post.save();
      res.json(post.comments);
    } catch (err) {
      console.log(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: ' Not found' });
      }
      return res.status(500).send('Sever Error');
    }
  }
);

//@route    DELETE api/posts/comments/:post_id/:comment_id
//@desc     Delete comment
//@access   Private
router.delete('/comments/:post_id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    const removeIndex = post.comments
      .map(com => com.id)
      .indexOf(req.params.comment_id);
    if (removeIndex === -1) {
      return res.status(404).json({ msg: 'Comment not found' });
    }
    if (post.comments[removeIndex].user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    post.comments.splice(removeIndex, 1);
    await post.save();
    res.json(post.comments);
  } catch (err) {
    console.log(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: ' Not found' });
    }
    return res.status(500).send('Sever Error');
  }
});

module.exports = router;
