const express = require('express');
const bodyParser = require('body-parser');
var _ = require('lodash');
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://coder:blog1234@cluster0.ppjqv.mongodb.net/BlogDB', {useNewUrlParser: true, useUnifiedTopology: true});

const app = express();
app.use(express.static(__dirname+'/public'))
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}))


const postSchema= new mongoose.Schema({
    name:String,
    content:String
})

const Post = mongoose.model('Post',postSchema);
const posts = [];
app.get('/',(req,res)=>{

Post.find({},function (err,foundList) {
    // console.log(foundList.length)
    if(foundList.length==0){
        const homePost= new Post({
            name:'home',
            content:"Lorem Ipsum is simplyorem Ipsum is simply dummy text of the prorem Ipsum is simply dummy text of the pr dummy text of the printing ing versions of Lorem Ipsum."
        })
        homePost.save();
        res.redirect('/')
    }else{
        res.render('index',{posts:foundList}) 
    }
})
// 
})

app.get('/add',(req,res)=>{
    res.render('add');
})

app.post('/add',(req,res)=>{
    const list = new Post({
        name:req.body.postTitle.split(' ').join('').split(',').join(''),
        content:req.body.postData
    })
    list.save()
    res.redirect('/');
    // console.log();
})
app.get('/posts/:postID',(req,res)=>{
   
const requestTitle = _.lowerCase(req.params.postID);

Post.findOne({name:requestTitle},function (err,docs) {
    res.render('posts',{
          title:requestTitle,content:docs.content
    })
})
})

app.get('/error',(req,res)=>{
    res.render('error')
})
app.post('/search',(req,res)=>{
    const postName=req.body.postName;
    Post.findOne({name:postName},function(err,foundList){
        if(foundList){
          res.redirect('/posts/'+postName)
        }else{
           res.redirect('/error');
        }
    })
})



app.listen(process.env.PORT || 3000,()=>{
    console.log('server is listening at port 3000');
})