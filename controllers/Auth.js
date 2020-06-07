const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateToken = require('../helpers/generate-token');
const { expirationDates, expirationMessage, isExpired } = require('../helpers/token-expiration');

const User = require('../models/User');
const ErrorHandler = require('../models/http-error');

class Auth {
  async signup(req, res, next) {
    const { email, username, password } = req.body;

    try {
      const hashedPw = await bcrypt.hash(password, 12);
      const user = await User.create({ username, email, password: hashedPw });

      res.status(201).json({
        message: 'successfully created user',
        userId: user.id
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    const { username, password } = req.body;

    try {
      const user = await User.getUserByUsername(username);
      const comparePw = await bcrypt.compare(password, user.password);

      if (!comparePw) throw new ErrorHandler('Wrong password', 401);

      const token = jwt.sign({
        userId: user.id
      }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  }

  async setAccountToken(req, res, next) {
    const { userId } = req.body;

    try {
      const user = await User.getUserById(userId);
      // checks for an existing token
      if (user.resetToken) {
        // eslint-disable-next-line no-unused-vars
        const [_, diff, sulfix] = expirationDates(user.resetTokenData);
        const message = expirationMessage(diff, sulfix);
        return res.status(200).json({
          message,
          resetToken: user.resetToken
        });
      }
      // generates the token
      const resetToken = await generateToken(32);
      const [dateLimits, diff, sulfix] = expirationDates();
      const message = expirationMessage(diff, sulfix);

      user.resetToken = resetToken;
      user.resetTokenData = dateLimits.expiration;
      await user.save();
      res.status(201).json({ message, resetToken });
    } catch (error) {
      next(error);
    }
  }

}

module.exports = new Auth();
