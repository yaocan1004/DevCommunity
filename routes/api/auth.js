const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../modules/User');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

//@route    GET api/auth
//@desc     Auth
//@access   Private

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    return res.json(user);
  } catch (err) {
    console.log(err.message);
    return res.status(500).send('Server Error');
  }
});

//@route    POST api/auth
//@desc     Login
//@access   Public
router.post(
  '/',
  [
    check('email', 'Please type into a valid email').isEmail(),
    check('password', 'Please enter the password').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      //See if the user exists
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }
      //Check password
      const isMatch = await bcryptjs.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      //Return jsonwebtoken
      const payload = {
        user: {
          id: user.id
        }
      };
      jwt.sign(
        payload,
        config.get('jwtToken'),
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
