const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

const router = express.Router();

const generateToken = (userId) => {
  return jwt.sign(
    { userId }, 
    process.env.JWT_SECRET || 'your-secret-key', 
    { 
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      issuer: 'daily-schedule-app',
      audience: 'daily-schedule-users'
    }
  );
};

const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId, type: 'refresh' }, 
    process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key', 
    { 
      expiresIn: '30d',
      issuer: 'daily-schedule-app',
      audience: 'daily-schedule-users'
    }
  );
};

router.post('/register', [
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'User with this email or username already exists' 
      });
    }

    const user = new User({ username, email, password });
    await user.save();

    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        token,
        refreshToken,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          preferences: user.preferences,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during registration' 
    });
  }
});

router.post('/login', [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        refreshToken,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          preferences: user.preferences
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during login' 
    });
  }
});

router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ 
        success: false,
        message: 'Refresh token required' 
      });
    }

    const decoded = jwt.verify(
      refreshToken, 
      process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key'
    );

    if (decoded.type !== 'refresh') {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token type' 
      });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'User no longer exists' 
      });
    }

    const newToken = generateToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    res.json({
      success: true,
      message: 'Tokens refreshed successfully',
      data: {
        token: newToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({ 
      success: false,
      message: 'Invalid refresh token' 
    });
  }
});

router.post('/logout', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during logout' 
    });
  }
});

router.get('/verify', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Token is valid',
      data: {
        user: {
          id: req.user._id,
          username: req.user.username,
          email: req.user.email,
          preferences: req.user.preferences
        }
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during token verification' 
    });
  }
});

module.exports = router;
//----------------------------------------------------------------------------------------------------------------//


// routes/auth.js
// const express = require('express');
// const router = express.Router();

// // Simple token generator (fake)
// const generateFakeToken = () => {
//   return 'fake-jwt-token-' + Math.random().toString(36).substring(2);
// };

// // REGISTER
// router.post('/register', (req, res) => {
//   const { username, email } = req.body;

//   return res.json({
//     success: true,
//     message: 'User registered successfully (dummy mode)',
//     data: {
//       token: generateFakeToken(),
//       refreshToken: generateFakeToken(),
//       user: {
//         id: Date.now().toString(),
//         username: username || 'dummyUser',
//         email: email || 'dummy@example.com',
//         preferences: {},
//         createdAt: new Date().toISOString(),
//       },
//     },
//   });
// });

// // LOGIN
// // router.post('/login', (req, res) => {
// //   const { email } = req.body;

// //   return res.json({
// //     success: true,
// //     message: 'Login successful (dummy mode)',
// //     data: {
// //       token: generateFakeToken(),
// //       refreshToken: generateFakeToken(),
// //       user: {
// //         id: '12345',
// //         username: 'dummyUser',
// //         email: email || 'dummy@example.com',
// //         preferences: {},
// //       },
// //     },
// //   });
// // });

// // // REFRESH TOKEN
// // router.post('/refresh', (req, res) => {
// //   return res.json({
// //     success: true,
// //     message: 'Tokens refreshed successfully (dummy mode)',
// //     data: {
// //       token: generateFakeToken(),
// //       refreshToken: generateFakeToken(),
// //     },
// //   });
// // });

// // // LOGOUT
// // router.post('/logout', (req, res) => {
// //   return res.json({
// //     success: true,
// //     message: 'Logout successful (dummy mode)',
// //   });
// // });

// // // VERIFY TOKEN
// // router.get('/verify', (req, res) => {
// //   return res.json({
// //     success: true,
// //     message: 'Token is valid (dummy mode)',
// //     data: {
// //       user: {
// //         id: '12345',
// //         username: 'dummyUser',
// //         email: 'dummy@example.com',
// //         preferences: {},
// //       },
// //     },
// //   });
// // });

// // module.exports = router;
