"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { getRestuarents, getRestuarent, createRestuarent, updateRestuarent, deleteRestuarent } = require("../controllers/restuarents");
const router = express_1.default.Router();
router.route('/').get(getRestuarents, createRestuarent);
router.route('/:id').get(getRestuarent, updateRestuarent, deleteRestuarent);
module.exports = router;
//# sourceMappingURL=restuarents.js.map