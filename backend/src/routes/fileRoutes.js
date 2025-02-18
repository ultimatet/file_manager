const express = require('express');
const router = express.Router();
const file = require('../controllers/fileController');

router.post('/file', file.createFile);
router.get('/file/:file_id', file.getFile);
router.get('/file', file.getAllFile);
router.put('/file/:file_id', file.updateFile);
router.delete('/file/:file_id', file.deleteFile);

module.exports = router;