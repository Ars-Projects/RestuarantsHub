import express from 'express';

const {
    getRestuarents, 
    getRestuarent, 
    createRestuarent, 
    updateRestuarent, 
    deleteRestuarent
} = require("../controllers/restuarents");


// Include other resource routers
const menuRouter = require("./menus");

const router = express.Router();

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