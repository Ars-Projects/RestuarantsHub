export {}
const express = require('express');

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/users');

const User = require('../models/User');

const router = express.Router({ mergeParams: true });

// const advancedResults = require('../middleware/advancedResults');
// const { protect, authorize } = require('../middleware/auth');

// //All routes under this are protected and  need authorized by admin
// router.use(protect);
// router.use(authorize('admin'));

router
  .route('/')
//   .get(advancedResults(User), getUsers)
  .post(createUser);

router
  .route('/:userId')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
