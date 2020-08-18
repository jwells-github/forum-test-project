var express = require('express');
var router = express.Router();
var loginController = require('../controllers/loginController');

/* GET home page. */
router.get('/', loginController.user_login_get);

router.post('/', loginController.user_login_post);

module.exports = router;
