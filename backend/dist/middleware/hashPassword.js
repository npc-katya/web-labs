import bcrypt from "bcryptjs";
const saltRounds = 10;
// хеширование пароля
const hashPassword = async (plainPassword) => {
    if (!plainPassword || typeof plainPassword !== "string") {
        throw new Error("пароль должен быть непустой строкой");
    }
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        return await bcrypt.hash(plainPassword, salt);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }
        throw new Error("ошибка при хешировании пароля");
    }
};
export { hashPassword };
