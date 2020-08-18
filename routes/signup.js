var express = require('express');
var router = express.Router();
var signupController = require('../controllers/signupController');

/* GET home page. */
router.get('/', signupController.user_create_get);

router.post('/', signupController.user_create_post);

module.exports = router;
