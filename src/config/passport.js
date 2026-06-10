const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await prisma.user.findUnique({ 
        where: { googleId: profile.id } 
      });

      if (!user) {
        const baseName = profile.displayName.replace(/\s+/g, '').toLowerCase();
        const uniqueUsername = `${baseName}_${Math.floor(Math.random() * 10000)}`;
        
        user = await prisma.user.create({
          data: {
            username: uniqueUsername,
            googleId: profile.id
          }
        });
      }

      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }
));