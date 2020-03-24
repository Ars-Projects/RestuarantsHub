import express from 'express';

const {getRestuarents, getRestuarent, createRestuarent, updateRestuarent, deleteRestuarent} = require("../controllers/restuarents");


const router = express.Router();

router.route('/').get(getRestuarents, createRestuarent);

router.route('/:id').get(getRestuarent, updateRestuarent, deleteRestuarent);

module.exports = router;