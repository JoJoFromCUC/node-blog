const express = require('express');
const router = express.Router();

const checkLogin = require('../middlewares/check').checkLogin ;
const PostModel = require('../models/posts');

router.get('/',function(req,res,next){
  res.render('posts');
});
router.get('/create',checkLogin,function(req,res,next){
  res.render('create');
});
router.post('/create',checkLogin,function(req,res,next){
  //res.send('write article');
  const
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
