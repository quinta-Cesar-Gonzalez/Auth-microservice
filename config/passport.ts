import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import User from '../models/User';
import logger from '../utils/logger';

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        logger.info(`Google profile data: ${JSON.stringify(profile)}`);
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : '';
        const displayName = profile.displayName || 'Usuario sin nombre';

        let user = await User.findOne({ client_googleId: profile.id });
        if (!user) {
          user = new User({
            client_googleId: profile.id,
            nombre: displayName,
            email: email,
          });
          await user.save();
        }
        return done(null, user);
      } catch (error) {
        return done(error, undefined);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);  // Usa await en lugar de un callback
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});