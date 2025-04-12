// проверка на корректность json
const errorHandler = (err, req, res, next) => {
    if (err instanceof SyntaxError && "status" in err && "body" in err) {
        const syntaxError = err;
        if (syntaxError.status === 400) {
            return res.status(400).json({ message: "некорректный JSON." });
        }
    }
    next();
};
export { errorHandler };
