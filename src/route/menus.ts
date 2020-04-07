import express from 'express';

const {
  getMenu,
  getFavouriteMenu,
  addMenu,
  updateMenu,
  deleteMenu,
  menuPhotoUpload
} = require('../controllers/menus');

const Menu = require('../models/Menu');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');

router.route('/favourites').get(getFavouriteMenu);

router.route('/:menuId/photo').put(menuPhotoUpload);

router
  .route('/')
  .get(
    advancedResults(Menu, {
      path: 'restuarent',
      select: 'name description averageRating'
    }),
    getMenu
  )
  .post(addMenu);
  
router
  .route('/:menuId')
  .put(updateMenu)
  .delete(deleteMenu);

module.exports = router;