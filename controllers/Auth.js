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

  async setResetPasswordToken(req, res, next) {
    const { username } = req.body;

    try {
      const user = await User.getUserByUsername(username);
      if (user.resetToken) {
        const isExpired = isExpired(user.resetTokenData);
        if (!isExpired) {
          res.status(401).json({
            message: 'You already have a valid token.'
          });
        }
      }

      const resetToken = await generateToken(32);
      const [dateLimits, diff, sulfix] = expirationDates();
      const message = expirationMessage(diff, sulfix);

      user.resetToken = resetToken;
      user.resetTokenData = dateLimits.expiration;
      await user.save();

      // implement your email api here

      res.status(201).json({ message });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req, res, next) {
    const { token } = req.params;
    const { password } = req.body;

    try {
      const user = await User.findOne({ where: { resetToken: token } });
      if (!user) throw new ErrorHandler('Invalid token', 404);
      const expired = isExpired(user.resetTokenData);
      if (expired) throw new ErrorHandler('Expired token', 401);

      const hashedPw = await bcrypt.hash(password, 12);
      user.password = hashedPw;
      user.resetToken = null;
      user.resetTokenData = null;
      await user.save();

      res.status(201).json({ message: 'Successfully updated password' });
    } catch (error) {
      next(error);
    }
  }

  async renameUser(req, res, next) {
    const { newUsername } = req.body;

    try {
      const user = await User.getUserById(req.userId);
      user.username = newUsername;
      await user.save();
      res.status(201).json({ message: 'Successfully updated username' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Auth();
