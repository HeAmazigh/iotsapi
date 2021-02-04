const express = require('express');
const {check} = require('express-validator');
const router = express.Router();

const UsersController = require('../controllers/users-controller');

router.post('/', UsersController.login);
router.post('/singup',[
    check('firstname').not().isEmpty(),
    check('lastname').not().isEmpty(),
    check('username').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({min: 8})
], UsersController.singup);

module.exports = router;