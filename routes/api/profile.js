const express = require('express');
const router = express.Router();
const Profile = require('../../modules/Profile');
const User = require('../../modules/User');
const Post = require('../../modules/Post');
const auth = require('../../middleware/auth');
const request = require('request');
const config = require('config');
const { check, validationResult } = require('express-validator');

//@route    GET api/profile/me
//@desc     Get current user's profile
//@access   Private

router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    );
    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }
    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//@route    POST api/profile
//@desc     Add or Update user's profile
//@access   Private
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status should not be empty')
        .not()
        .isEmpty(),
      check('skills', 'Skills should not be empty')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      company,
      website,
      location,
      status,
      skills,
      bio,
      githubusername,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;

    //Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (status) profileFields.status = status;
    if (bio) profileFields.bio = bio;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    //build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        //Update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      } else {
        //Create the profile
        profile = new Profile(profileFields);
        await profile.save();
        return res.json(profile);
      }
    } catch (err) {
      console.log(err.message);
      return res.status(500).send('Server Error');
    }
  }
);

//@route    GET api/profile
//@desc     Get all profiles
//@access   Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server Error');
  }
});

//@route    GET api/profile/user/:user_id
//@desc     Get profiles by userID
//@access   Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'No profile for user' });
    }
    res.json(profile);
  } catch (error) {
    console.log(error.message);
    if (error.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'No profile for user' });
    }
    res.status(500).send('Server Error');
  }
});

//@route    DELETE api/profile
//@desc     Delete profile, user, and post
//@access   Private
router.delete('/', auth, async (req, res) => {
  try {
    //@-todo remove posts
    await Post.deleteMany({ user: req.user.id });
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: 'Succeed removed' });
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server Error');
  }
});

//@route    PUT api/profile/experience
//@desc     Add experience
//@access   Private
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is required')
        .not()
        .isEmpty(),
      check('company', 'Company is required')
        .not()
        .isEmpty(),
      check('from', 'From date is required')
        .not()
        .isEmpty(),
      check('current', 'Current is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;
    const newExperience = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    };
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(newExperience);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Server Error');
    }
  }
);

//@route    DELETE api/profile/experience/:exp_id
//@desc     Delete profile, user, and post
//@access   Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    //@-todo remove posts
    const profile = await Profile.findOne({ user: req.user.id });
    const exp = profile.experience;
    const removeIndex = exp.map(exp => exp._id).indexOf(req.params.exp_id);
    exp.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server Error');
  }
});

//@route    PUT api/profile/education
//@desc     Add education
//@access   Private
router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School is required')
        .not()
        .isEmpty(),
      check('degree', 'Degree is required')
        .not()
        .isEmpty(),
      check('fieldofstudy', 'Fieldofstudy is required')
        .not()
        .isEmpty(),
      check('from', 'From date is required')
        .not()
        .isEmpty(),
      check('current', 'Current is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body;
    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    };
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.education.unshift(newEdu);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Server Error');
    }
  }
);

//@route    DELETE api/profile/education/:exp_id
//@desc     Delete profile, user, and post
//@access   Private
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    //@-todo remove posts
    const profile = await Profile.findOne({ user: req.user.id });
    const edu = profile.education;
    const removeIndex = edu.map(edu => edu._id).indexOf(req.params.edu_id);
    edu.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server Error');
  }
});

//@route    GET api/profile/github/:username
//@desc     Get github repo
//@access   Public
router.get('/github/:username', (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        'clientId'
      )}&client_secret=${config.get('clientSecret')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' }
    };
    request(options, (error, response, body) => {
      if (error) console.error(error);
      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: 'User not found' });
      }
      res.json(JSON.parse(body));
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
