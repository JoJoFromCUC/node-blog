const express = require('express');
const router = express.Router();
const sha1 = require('sha1');

const checkNotLogin = require('../middlewares/check').checkNotLogin;
const UserModel = require('../models/users');

router.get('/',checkNotLogin, function(req,res,next){
  //res.send('login page');
  res.render('signin');
});
router.post('/',checkNotLogin,function(req,res,next){
  //res.send('login');
  const name = req.fields.username;
  const password = req.fields.password;

  try{
    if(!name.length){
      throw new Error('请填写用户名');
    }
    if(!password.length){
      throw new Error('请填写密码');
    }
  }catch(e){
    req.flash('error',e.message);
    return res.redirect('back');
  }

  UserModel.getUserByName(name)
  .then(function(user){
    if(!user){
      req.flash('error','用户不存在');
      return res.redirect('back');
    }
    if(sha1(password) !== user.password){
      req.flash('error','密码错误');
      res.redirect('back');
    }
    req.session.user = user;
    delete user.password;
    req.flash('success','登录成功');
    res.redirect('/posts');
  })
  .catch(next);
});
module.exports = router;
