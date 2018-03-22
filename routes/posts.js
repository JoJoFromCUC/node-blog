const express = require('express');
const router = express.Router();

const checkLogin = require('../middlewares/check').checkLogin ;
const PostModel = require('../models/posts');
const CommentModel = require('../models/comments');

router.get('/',function(req,res,next){
  //res.render('posts');
  const author = req.query.author;//author存在与否均可
  PostModel.getPosts(author)
    .then(function(posts){
      console.log(posts);
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
    req.flash('success','发布成功');
    res.redirect(`/posts/${post._id}`);
  })
  .catch(next);
});

router.get('/:postId',checkLogin,function(req,res,next){
  const postId = req.params.postId;
  Promise.all([
    PostModel.getPostById(postId),
    PostModel.incPv(postId),
    CommentModel.getComments(postId)
  ])
  .then(function(result){
    const post = result[0];
    const comments = result[2];
    console.log('comments:',comments);
    if(!post){
      throw new Error('文章不存在');
    }
    res.render('post',{
      post: post,
      comments: comments
    });
  })
  .catch(next);
});

router.get('/:postId/edit',checkLogin,function(req,res,next){
  const author = req.session.user._id;
  const postId = req.params.postId;
  PostModel.getRawPostById(postId)
    .then(function(post){
      if(!post){
        throw new Error('文章不存在');
      }
      if(author.toString() !== post.author._id.toString()){
        throw new Error('没有修改权限');
      }
      res.render('edit',{post: post});
    })
    .catch(next);
  //res.send('edit article page');
});
router.post('/:postId/edit',checkLogin,function(req,res,next){
  const title = req.fields.title;
  const content = req.fields.content;
  const author = req.session.user._id;
  const postId = req.params.postId;

  try{
    if(!title.length){
      throw new Error('标题不能为空');
    }
    if(!content.length){
      throw new Error('内容不能为空');
    }
  }catch(e){
    req.flash('error',e.message);
    return res.redirect('back');
  }

  PostModel.getRawPostById(postId)
    .then(function(post){
      if(!post){
        throw new Error('文章不存在');
      }
      if(author.toString() !== post.author._id.toString()){
        throw new Error('没有修改权限');
      }
      PostModel.updatePostById(postId,{title: title,content: content})
        .then(function(){
          req.flash('success','修改成功');
          res.redirect(`/posts/${postId}`);
        });
    });
})
router.get('/:postId/remove',checkLogin,function(req,res,next){
  const author = req.session.user._id;
  const postId = req.params.postId;
  PostModel.getRawPostById(postId)
  .then(function(post){
    if(!post){
      throw new Error('文章不存在');
    }
    if(post.author._id.toString() !== author.toString()){
      throw new Error('没有删除权限');
    }
    PostModel.delPostById(postId)
    .then(function(){
      req.flash('success','删除成功');
      res.redirect('/posts');
    })
  })
});

module.exports = router;
