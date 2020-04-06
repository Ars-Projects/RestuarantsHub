"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { getMenu, getFavouriteMenu, addMenu, updateMenu, deleteMenu } = require('../controllers/menus');
const Menu = require('../models/Menu');
const router = express_1.default.Router({ mergeParams: true });
const advancedResults = require('../middleware/advancedResults');
router
    .route('/')
    .get(advancedResults(Menu, {
    path: 'restuarent',
    select: 'name description averageRating'
}), getMenu)
    .post(addMenu);
router.route('/favourites').get(getFavouriteMenu);
router
    .route('/:menuId')
    .put(updateMenu)
    .delete(deleteMenu);
module.exports = router;
//# sourceMappingURL=menus.js.map