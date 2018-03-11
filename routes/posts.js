const express = require('express');
const router = express.Router();

const checkLogin = require('../middlewares/check').checkLogin ;

router.get('/',function(req,res,next){
  res.send('index page');
});
router.get('/create',checkLogin,function(req,res,next){
  res.send('write article page');
});
router.post('/create',checkLogin,function(req,res,next){
  res.send('write article');
});
router.get('/:postId',checkLogin,function(req,res,next){
  res.send('article page');
});
router.get('/:postId/edit',checkLogin,function(req,res,next){
  res.send('edit article page');
});
router.post('/:postId/edit',checkLogin,function(req,res,next){
  res.send('edit article');
})
router.get('/:postId/remove',checkLogin,function(req,res,next){
  res.send('remove article');
});

module.exports = router;
