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
        logger.info(`[Passport - GoogleStrategy]: Initiating Google authentication for user with Google ID: ${profile.id}`);
        let user = await User.findOne({ client_googleId: profile.id });
        if (!user) {
          logger.info(`[Passport - GoogleStrategy]: No existing user found, creating a new user for Google ID: ${profile.id}`);
          user = new User({
            client_googleId: profile.id,
            nombre: profile.displayName || 'Unnamed User',
            email: profile.emails?.[0]?.value || '',
          });
          await user.save();
          logger.info(`[Passport - GoogleStrategy]: Successfully created new user for Google ID: ${profile.id}`);
        } else {
          logger.info(`[Passport - GoogleStrategy]: Existing user found for Google ID: ${profile.id}`);
        }

        return done(null, user);
      } catch (error) {
        if (error instanceof Error) {
          logger.error(`[Passport - GoogleStrategy]: Error during Google authentication for Google ID: ${profile.id}. Error: ${error.message}`);
        } else {
          logger.error(`[Passport - GoogleStrategy]: Unknown error during Google authentication for Google ID: ${profile.id}`);
        }
        return done(error as Error, undefined);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  try {
    logger.info(`[Passport - serializeUser]: Serializing user with ID: ${user.id}`);
    done(null, user.id);
    logger.info(`[Passport - serializeUser]: Successfully serialized user`);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`[Passport - serializeUser]: Error serializing user. Error: ${error.message}`);
    } else {
      logger.error(`[Passport - serializeUser]: Unknown error serializing user`);
    }
    done(error as Error);
  }
});

passport.deserializeUser(async (id, done) => {
  try {
    logger.info(`[Passport - deserializeUser]: Attempting to deserialize user with ID: ${id}`);
    const user = await User.findById(id);
    if (user) {
      logger.info(`[Passport - deserializeUser]: Successfully deserialized user`);
      done(null, user);
    } else {
      logger.warn(`[Passport - deserializeUser]: No user found for the provided ID`);
      done(null, null);
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`[Passport - deserializeUser]: Error deserializing user with ID: ${id}. Error: ${error.message}`);
    } else {
      logger.error(`[Passport - deserializeUser]: Unknown error deserializing user with ID: ${id}`);
    }
    done(error as Error, null);
  }
});
