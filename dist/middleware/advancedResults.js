var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const advancedResults = (model, populate) => (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let query;
    // Copy req.query
    const reqQuery = Object.assign({}, req.query);
    //fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach(param => delete reqQuery[param]);
    //create query string
    let queryStr = JSON.stringify(reqQuery);
    //create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(g|gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    //Finding resource
    query = model.find(JSON.parse(queryStr));
    //Select fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }
    //Sort
    if (req.query.sort) {
        const fields = req.query.sort.split(',').join(' ');
        query = query.sort(fields);
    }
    else {
        query = query.sort('-createdAT');
    }
    //Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = (page + 1) * limit;
    const total = yield model.countDocuments();
    query = query.skip(startIndex).limit(limit);
    if (populate) {
        query = query.populate(populate);
        // .exec(function(err, data) {
        //   if (err) return handleError(err);
        //   res.json(data);
        // });
        console.log(populate);
    }
    //Executing query
    const results = yield query;
    //Pagination result
    let pagination = {
        next: {
            page,
            limit
        },
        prev: {
            page,
            limit
        }
    };
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        };
    }
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        };
    }
    res.advancedResults = {
        success: true,
        count: results.length,
        pagination,
        data: results
    };
    next();
});
module.exports = advancedResults;
//# sourceMappingURL=advancedResults.js.map