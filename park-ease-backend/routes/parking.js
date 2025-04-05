const express = require('express');
const { getNearby, getParking } = require('../controllers/parking');

const router = express.Router();

router.get('/nearby', getNearby);
router.get('/:id', getParking);

module.exports = router;