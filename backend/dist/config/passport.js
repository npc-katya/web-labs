var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Strategy as JwtStrategy, ExtractJwt, } from "passport-jwt";
import passport from "passport";
import User from "../models/User.js";
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
// типизированный verify callback
const verifyCallback = (payload, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User.findByPk(payload.id);
        if (user) {
            return done(null, user);
        }
        return done(null, false);
    }
    catch (error) {
        return done(error, false);
    }
});
passport.use(new JwtStrategy(options, verifyCallback));
export { passport };
