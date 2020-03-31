import express from 'express';

const { getMenu, addMenu, updateMenu, deleteMenu } = require('../controllers/menus');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getMenu)
  .post(addMenu);


  
router
  .route('/:menuId')
  .put(updateMenu)
  .delete(deleteMenu);

module.exports = router;