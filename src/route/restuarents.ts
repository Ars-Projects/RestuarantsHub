import express from 'express';

const {
  getRestuarents,
  getRestuarent,
  createRestuarent,
  updateRestuarent,
  deleteRestuarent,
  getRestuarentsInRadius,
  restuarentPhotoUpload,
} = require('../controllers/restuarents');

const Restuarent = require('../models/Restuarent');

// Include other resource routers
const menuRouter = require("./menus");
const orderRouter = require('./orders');

const router = express.Router();

const advancedResults = require('../middleware/advancedResults');

//Re-route into resource router
router.use("/:restuarentId/menus", menuRouter);
router.use('/:restuarentId/orders', orderRouter);

router.route('/radius/:zipcode/:distance').get(getRestuarentsInRadius);

router
  .route('/:restuarentId/photo')
  .put(restuarentPhotoUpload);

router
  .route('/')
  .get(
    advancedResults(Restuarent, {
      path: 'menus',
      select: 'favourites'
    }),
    getRestuarents
  )
  .post(createRestuarent);

router
  .route('/:restuarentId')
  .get(getRestuarent)
  .put(updateRestuarent)
  .delete(deleteRestuarent);

module.exports = router;