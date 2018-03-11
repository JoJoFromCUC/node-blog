const express = require('express');
const router = express.Router();

const checkLogin = require('../middlewares/check').checkLogin;

router.post('/',checkLogin,function(req,res,next){
  res.send('create comment');
});
router.get('/:commentId/remove',checkLogin,function(req,res,next){
  res.send('remove comment');
});
module.exports = router;
