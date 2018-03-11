module.exports = {
  checkLogin: function checkLogin(req,res,next){
    if(!req.session.user){
      req.flash('error','not signIn');
      return res.redirect('/signin');
    }
    next();
  },
  checkNotLogin: function checkNotLogin(req,res,next){
    if(req.session.user){
      req.flash('error','already signIn');
      return res.redirect('back');
    }
    next();
  }
}
