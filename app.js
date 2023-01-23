const express = require("express");
const bodyParser = require("body-parser");
const ejs=require("ejs")
const app = express();
const mongoose=require("mongoose")
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb://127.0.0.1:27017/wikiDB",{useNewUrlParser: true});
const ArticleSchema={
    title:{
        type:String
    },
    content:{
        type:String
    }
}
const Article=mongoose.model("articles",ArticleSchema)

app.route("/articles")
.get(function(req,response){
    console.log("get request hit")
    Article.find(function(err,res){
        if(!err){
            console.log(res)
            response.send(res)
        }else{
            console.log("error emcountered while finding")
            response.send(err)
        }
    })
})
.post(function(req,resp){
    console.log(req.body.title)
    console.log(req.body.content)
    const newArticle=new Article({
        title:req.body.title,
        content:req.body.content
    })
    newArticle.save(function(err){
        if(!err){
            console.log("successful added to articles")
        }else{
            console.log("not added to articles")
        }
    })
})
.delete(function(req,res){
    Article.findOneAndDelete(function(err,found){
        if(found){
            console.log("deleted successfully") 
        }else{
            console.log("not deleted")
        }
    })
})

app.route("/articles/:aticleTitle")
.get(
    function(req,res){
        Article.findOne({title:req.params.aticleTitle},function(err,foundArticle){
            if(foundArticle){
                res.send(foundArticle)
                console.log("found article:- "+ foundArticle)
            }else{
                res.send("no article found")
                console.log("no such article found while get request")
            }
        })
    }
).put(
    function(req,res){
        Article.updateOne({title:req.params.aticleTitle},{title:req.body.title,content:req.body.content},{overwrite:true},function(err){
            if(!err){
                res.send("succefully updated the article")
            }else{
                res.send("not updated the article")
            }
        })
    }
)
.patch(
    function(req,res){
        Article.updateOne({title:req.params.aticleTitle},{$set:req.body},function(err){
            if(!err){
                res.send("Sucessfully updated article") 
            }else{
                res.send("not successfully updated article")
            }
        })
    }
)
// .post()
.delete(
    function(req,res){
        Article.findOneAndRemove({title:req.params.aticleTitle},function(err){
            if(!err){
                res.send("deleted succcessfully")
            }else{
                res.send("Not deleted successfully")
            }
        })
    }
)

app.listen(3000,function(){
    console.log("Server started on port 3000")
})