"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { getRestuarents, getRestuarent, createRestuarent, updateRestuarent, deleteRestuarent } = require("../controllers/restuarents");
// Include other resource routers
const menuRouter = require("./menus");
const router = express_1.default.Router();
//Re-route into resource router
router.use("/:restuarentId/menus", menuRouter);
router
    .route('/')
    .get(getRestuarents)
    .post(createRestuarent);
router
    .route('/:id')
    .get(getRestuarent)
    .put(updateRestuarent)
    .delete(deleteRestuarent);
module.exports = router;
//# sourceMappingURL=restuarents.js.map