const express = require('express');
const router = express.Router();
const file = require('../controllers/fileController');


router.post('/user/', file.createFile);
router.get('/user/:/user_id/file/:file_id', file.getFile);
router.get('/user/:/user_id/file/', file.getAllFile);
router.update('/user/:/user_id/file/:file_id', file.updateFile);
router.delete('/user/:/user_id/file/:file_id', file.deleteFile);

module.exports = router;