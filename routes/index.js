const express = require('express');
const router = express.Router();
const problem1Controller = require('../controllers/problem1.controller');
const problem2Controller = require('../controllers/problem2.controller');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.post('/upload-file', problem1Controller.problem1);
router.post('/upload-file-2', problem2Controller.problem2);
router.post('/download-file', problem1Controller.dowloadFile);

module.exports = router;
