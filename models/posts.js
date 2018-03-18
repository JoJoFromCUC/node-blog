const Post = require('../lib/mongo').Post;
const marked = require('marked');

Post.plugin('contentToHtml',{
  afterFind: function(posts){
    return posts.map(function(post){
      post.content = marked(post.content);
      return post;
    });
  },
  afterFindOne: function(post){
    if(post){
      post.content = marked(post.content);
    }
    return post;
  }
});

module.exports = {
  create: function create(post){
    return Post.create(post).exec();
  },
  getPostById: function getPostById(id){
    return Post
    .findOne({_id: id})
    .populate({path:'author',model: 'User'})
    .addCreatedAt()
    .contentToHtml()
    .exec();
  },
  //获取某个用户所有文章
  getPosts: function getPosts(author){
    const query = {};
    if(author) query.author = author;
    return Post
    .find({query})
    .populate({path:'author',model:'User'})
    .sort({_id: -1})
    .addCreatedAt()
    .contentToHtml()
    .exec();
  },
  incPv: function incPv(id){
    return Post
    .update({_id: id},{$inc:{pv:1}})
    .exec();
  }
}
