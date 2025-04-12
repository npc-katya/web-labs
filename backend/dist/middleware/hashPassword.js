var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcrypt from "bcryptjs";
const saltRounds = 10;
// хеширование пароля
const hashPassword = (plainPassword) => __awaiter(void 0, void 0, void 0, function* () {
    if (!plainPassword || typeof plainPassword !== "string") {
        throw new Error("пароль должен быть непустой строкой");
    }
    try {
        const salt = yield bcrypt.genSalt(saltRounds);
        return yield bcrypt.hash(plainPassword, salt);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }
        throw new Error("ошибка при хешировании пароля");
    }
});
export { hashPassword };
