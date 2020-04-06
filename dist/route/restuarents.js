"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { getRestuarents, getRestuarent, createRestuarent, updateRestuarent, deleteRestuarent, getRestuarentsInRadius, } = require('../controllers/restuarents');
const Restuarent = require('../models/Restuarent');
// Include other resource routers
const menuRouter = require("./menus");
const orderRouter = require('./orders');
const router = express_1.default.Router();
const advancedResults = require('../middleware/advancedResults');
//Re-route into resource router
router.use("/:restuarentId/menus", menuRouter);
router.use('/:restuarentId/orders', orderRouter);
router.route('/radius/:zipcode/:distance').get(getRestuarentsInRadius);
router
    .route('/')
    .get(advancedResults(Restuarent, {
    path: 'menus',
    select: 'favourites'
}), getRestuarents)
    .post(createRestuarent);
router
    .route('/:id')
    .get(getRestuarent)
    .put(updateRestuarent)
    .delete(deleteRestuarent);
module.exports = router;
//# sourceMappingURL=restuarents.js.map