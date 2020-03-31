"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { getMenu, addMenu, updateMenu, deleteMenu } = require('../controllers/menus');
const router = express_1.default.Router({ mergeParams: true });
router
    .route('/')
    .get(getMenu)
    .post(addMenu);
router
    .route('/:menuId')
    .put(updateMenu)
    .delete(deleteMenu);
module.exports = router;
//# sourceMappingURL=menus.js.map