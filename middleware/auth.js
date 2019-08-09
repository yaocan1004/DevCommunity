const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
  //Get PWT
  const token = req.header('x-auth-token');

  //check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  //Verify the token
  try {
    const decoded = jwt.verify(token, config.get('jwtToken'));
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
