const asynchandler = fn => (req, res, next) => Promise
    .resolve(fn(req, res, next))
    .catch(next);
module.exports = asynchandler;
//# sourceMappingURL=async.js.map