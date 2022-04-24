const passport = require('passport');
const PassportJWT = require('passport-jwt');
const PassportLocal = require('passport-local');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

passport.use(
  new PassportLocal.Strategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email }).select('+password');
        if (user && (await bcrypt.compare(password, user.password))) {
          delete user.password;
          done(null, user);
        } else {
          done(null, false);
        }
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  new PassportJWT.Strategy(
    {
      jwtFromRequest: PassportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload.id);
        if (user) done(null, payload);
        else throw new Error();
      } catch (error) {
        done(null, false);
      }
    }
  )
);
