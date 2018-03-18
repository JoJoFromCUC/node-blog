const express = require('express');
const router = express.Router();

const checkLogin = require('../middlewares/check').checkLogin ;
const PostModel = require('../models/posts');

router.get('/',function(req,res,next){
  //res.render('posts');
  const author = req.query.author;
  PostModel.getPosts(author)
    .then(function(posts){
      res.render('posts',{posts: posts});
    })
  .catch(next);
});
router.get('/create',checkLogin,function(req,res,next){
  res.render('create');
});
router.post('/create',checkLogin,function(req,res,next){
  //res.send('write article');
  const author = req.session.user._id;
  const title = req.fields.title;
  const content = req.fields.content;
  try{
    if(!title.length){
      throw new Error('标题不能为空');
    }
    if(!content.length){
      throw new Error('内容不能为空');
    }
  }catch(e){
   req.flash('error',e.message);
   res.redirect('back');
  }

  let post = {
    author: author,
    title: title,
    content: content
  };

  PostModel.create(post)
  .then(function(result){
    post = result.ops[0];
    console.log(result);
    req.flash('success','发布成功');
    res.redirect(`/posts/:${post._id}`);
  })
  .catch(next);
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
