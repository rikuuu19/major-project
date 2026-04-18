module.exports = (fn) => {
    return function (req, res, next) {
        console.log("Route executing:", req.originalUrl);
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};