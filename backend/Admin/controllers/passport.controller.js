const { Strategy } = require("passport-google-oauth20");
const dotenv = require("dotenv")
const passport = require("passport")
dotenv.config();

let GoogleStrategy = Strategy;

function configurePassport(passport){
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.AUTH_GOOGLE_ID,
        clientSecret: process.env.AUTH_GOOGLE_SECRET,
        callbackURL: "http://localhost:5000/api/googleAuth/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = {
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0]?.value,
            photo: profile.photos?.[0]?.value,
          };

          
          done(null, user);
        } catch (error) {
          done(error, null);
        }
      },
    ),
  );
}

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = {configurePassport}