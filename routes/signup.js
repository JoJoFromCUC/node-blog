const express = require('express');
const fs = require('fs');
const path = require('path');
const sha1 = require('sha1');
const router = express.Router();

const checkNotLogin = require('../middlewares/check').checkNotLogin;
const UserModel = require('../models/users');

router.get('/',checkNotLogin, function(req,res,next){
  res.render('signup');
});
router.post('/',checkNotLogin, function(req,res,next){
  //res.send('signup');
  const name = req.fields.name;
  let   password = req.fields.password;
  const gender = req.fields.gender;
  const bio = req.fields.bio;
  const avatar = req.files.avatar.path.split(path.sep).pop();
  const repassword = req.fields.repassword;

  try{
    if(name.length <= 1 || name.length >= 10){
      throw new Error('名字请限制在10个字符以内');
    }
    if(['m','f','x'].indexOf(gender) === -1){
      throw new Error('性别非标准');
    }
    if(bio.length <= 1 || bio.length >= 30){
      throw new Error('简介字数应在30字以内');
    }
    if(!req.files.avatar.name){
      throw new Error('缺少头像');
    }
    if(password.length < 6){
      throw new Error('密码长度不够');
    }
    if(password !== repassword){
      throw new Error('两次密码不一致');
    }
  }catch(e){
    fs.unlink(req.files.avatar.path);//异步删除上传的头像
    req.flash('error',e.meessage);
    return res.redirect('/signup');
  }

  //密码加密
  password = sha1(password);

  let user = {
    name: name,
    password: password,
    gender: gender,
    avatar: avatar,
    bio: bio,
  };

  UserModel.create(user)
  .then(function(result){
    user = result.ops[0];
    delete user.password;
    req.session.user = user;
    req.flash('success','注册成功');
    res.redirect('/posts');
  }).catch(function(e){//写入数据库失败
    fs.unlink(req.files.avatar.path);
    if(e.meessage.match('duplicate key')){
      req.flash('error','用户名被占用');
      return res.redirect('/signup');
    }
    next(e);
  })
});

module.exports = router;
