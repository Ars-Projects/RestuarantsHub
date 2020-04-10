"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { getMenu, getFavouriteMenu, createMenu, addMenu, updateMenu, deleteMenu, menuPhotoUpload, } = require('../controllers/menus');
const Menu = require('../models/Menu');
const router = express_1.default.Router({ mergeParams: true });
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');
router.route('/favourites').get(getFavouriteMenu);
router.route('/:menuId/photo').put(protect, authorize('admin', 'owner'), menuPhotoUpload);
router.route('/addMenu').post(protect, authorize('admin', 'owner'), addMenu);
router
    .route('/')
    .get(advancedResults(Menu, {
    path: 'restuarant',
    select: 'name description averageRating',
}), getMenu)
    .post(protect, authorize('admin', 'owner'), createMenu);
router
    .route('/:menuId')
    .put(protect, authorize('admin', 'owner'), updateMenu)
    .delete(protect, authorize('admin', 'owner'), deleteMenu);
module.exports = router;
//# sourceMappingURL=menus.js.map