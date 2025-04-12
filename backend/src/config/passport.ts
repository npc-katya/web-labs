import {
  Strategy as JwtStrategy,
  ExtractJwt,
  type VerifyCallback,
} from "passport-jwt";
import passport from "passport";
import User from "@models/User";
import dotenv from "dotenv";

dotenv.config();

// проверка на наличие JWT_SECRET
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET не найден");
}

// настройка JWT-стратегии
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

// тип для JWT payload
interface JwtPayload {
  id: number;
  [key: string]: unknown;
}

// типизированный verify callback
const verifyCallback: VerifyCallback = async (payload: JwtPayload, done) => {
  try {
    const user = await User.findByPk(payload.id);
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
};

passport.use(new JwtStrategy(options, verifyCallback));

export { passport };
