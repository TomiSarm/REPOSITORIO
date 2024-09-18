import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/user.js'; 
import config from './config.js'; 

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
  secretOrKey: config.jwtSecret 
};

const passportConfig = (passport) => {
    passport.use(
      new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
          const user = await User.findById(jwt_payload.id);
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        } catch (error) {
          console.error(error);
          return done(error, false);
        }
      })
    );
  };
  
  export default passportConfig;