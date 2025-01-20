const express = require('express');
const router = express.Router();
const user = require('../controllers/userController');


router.post('/user/', user.createUser);
router.get('/user/:user_id', user.getUser);
router.delete('/user/:user_id', user.deleteUser);

module.exports = router;