var express = require('express');
var router = express.Router();

var userController = require('../controllers/userController')

router.get('/:username', userController.profile_get);

module.exports = router;
