const formidable = require('formidable');
const slugify = require('slugify');
const _ = require('lodash')
const {errorHandler} = require("../heplers/dbErrorHandler");
const {stripHtml} = require("string-strip-html")
const fs = require('fs')
const {smartTrim} = require("../heplers/blog");

//models
const Blog = require("../models/blogModel");
const Category = require("../models/categoryModel");
const Tag = require("../models/tagModel");

//creating blog
exports.createBlog = async(req,res) =>{
    try{
        let form = new formidable.IncomingForm()
        form.keepExtensions = true
        form.parse(req,(err,fields,files)=>{
            if(err){
                return res.status(400).json({
                    status:false,
                    msg:err.message
                })
            }

            const {title,body,categories,tags} = fields

            let blog = new Blog()
            blog.title = title
            blog.body=body
            blog.excerpt = smartTrim(body,320,' ',' ...');
            blog.slug=slugify(title).toLowerCase()
            blog.mtitle = `${title} | Blog`
            blog.mdesc = stripHtml(body.substring(0,160)).result;
            blog.postedBy = req.user._id

            let listOfCategories = categories.split(',')
            let listOfTags = tags.split(',')

            if(files.photo){
                if(files.photo.size > 1000000){
                    return res.status(400).json({
                        status:false,
                        msg:'Photo can not be greator than 1MB size.'
                    });
                }
                blog.photo.data = fs.readFileSync(files.photo.filepath)
                blog.photo.contentType = files.photo.type
            }
            blog.save((err,result) =>{
                if(err){
                    return res.status(400).json({
                        status:false,
                        msg:err
                    })
                }
                Blog.findByIdAndUpdate(result._id,{$push:{categories:listOfCategories}},{new:true}).exec((err,result) =>{
                    if(err){
                        return res.status(400).json({
                            status:false,
                            msg:err
                        })
                    }else{
                        Blog.findByIdAndUpdate(result._id,{$push:{tags:listOfTags}},{new:true}).exec((err,result) =>{
                            if(err){
                                return res.status(400).json({
                                    status:false,
                                    msg:err
                                })
                            }else{
                                res.status(201).json({
                                    status:true,
                                    blog:result
                                })

                            }
                        })
                    }
                })
            })
        })

    }catch(err){
        console.log(err)
        return res.status(500).json({
            status:false,
            msg:err.message
        })
    }
}


exports.getListBlogs = async(req,res) =>{
    try{
        const blog = await Blog.find({})
                        .populate('categories','_id name slug')
                        .populate('tags','_id name slug')
                        .populate('postedBy','_id name username')
                        .select('_id title slug excerpt categories tags postedBy createdAt updatedAt')
        res.status(200).json({
            status:true,
            results:blog.length,
            blog
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            status:false,
            msg:err.message
        })
    }
}


exports.getListBlogsCatsTags = async(req,res) =>{
    try{

    }catch(err){
        console.log(err)
        return res.status(500).json({
            status:false,
            msg:err.message
        })
    }
}

exports.getOneBlog = async(req,res) =>{
    try{

    }catch(err){
        console.log(err)
        return res.status(500).json({
            status:false,
            msg:err.message
        })
    }
}

exports.deleteOneBlog = async(req,res) =>{
    try{

    }catch(err){
        console.log(err)
        return res.status(500).json({
            status:false,
            msg:err.message
        })
    }
}


exports.updateOneBlog = async(req,res) =>{
    try{

    }catch(err){
        console.log(err)
        return res.status(500).json({
            status:false,
            msg:err.message
        })
    }
}
