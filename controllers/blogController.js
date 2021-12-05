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
                if(files.photo.size > 10000000){
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
        let limit = req.body.limit ? parseInt(req.body.limit):10;
        let skip = req.body.skip ? parseInt(req.body.skip):0;

        let blogs = await Blog.find({})
            .populate('categories','_id name slug')
            .populate('tags','_id name slug')
            .populate('postedBy','_id name username profile')
            .sort({createdAt:-1})
            .skip(skip)
            .limit(limit)
            .select('_id title slug excerpt categories tags postedBy createdAt updatedAt');

        let categories = await Category.find({});
        let tags = await Tag.find({})

        res.status(200).json({
            status:true,
            results:blogs.length,
            blogs,
            categories,
            tags
        })


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
        let blog = await Blog.findOne({slug:req.params.slug.toLowerCase()})
            .populate('categories','_id name slug')
            .populate('tags','_id name slug')
            .populate('postedBy','_id name username profile')
            .select('_id title body slug mtitle mdesc categories tags postedBy createdAt updatedAt');
        
        res.status(200).json({
            status:true,
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

exports.deleteOneBlog = async(req,res) =>{
    try{
        let blog = await Blog.findOneAndDelete({slug:req.params.slug.toLowerCase()})
        res.status(200).json({
            status:true,
            msg:"Blog deleted"
        })

    }catch(err){
        console.log(err)
        return res.status(500).json({
            status:false,
            msg:err.message
        })
    }
}

//updating blog
exports.updateOneBlog = async(req,res) =>{
    const slug = req.params.slug.toLowerCase();

    Blog.findOne({slug}).exec((err,oldBlog) =>{
        if(err){
            return res.status(400).json({
                status:false,
                msg:errorHandler(err)
            })
        }
        let form = new formidable.IncomingForm()
        form.keepExtensions = true

        form.parse(req,(err,fields,files)=>{
            if(err){
                return res.status(400).json({
                    status:false,
                    msg:err.message
                })
            }
    
            let slugBeforeMerge = oldBlog.slug
            oldBlog = _.merge(oldBlog,fields)
            oldBlog.slug = slugBeforeMerge

            const {body,mdesc,categories,tags} = fields

            if(body){
                oldBlog.excerpt = smartTrim(body,320,' ',' ...')
                oldBlog.mdesc = stripHtml(body.substring(0,160));
            }

            if(categories){
                oldBlog.categories = categories.split(",")
            }

            if(tags){
                oldBlog.tags = tags.split(",")
            }
    
            if(files.photo){
                if(files.photo.size > 10000000){
                    return res.status(400).json({
                        status:false,
                        msg:'Photo can not be greator than 1MB size.'
                    });
                }
                oldBlog.photo.data = fs.readFileSync(files.photo.filepath)
                oldBlog.photo.contentType = files.photo.type
            }
            oldBlog.save((err,result) =>{
                if(err){
                    return res.status(400).json({
                        status:false,
                        msg:err
                    })
                }
                res.status(200).json({
                    status:true,
                    blog:result
                })
            })
        })

    })
}
