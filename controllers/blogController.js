const formidable = require('formidable');
const slugify = require('slugify');
const _ = require('lodash')
const {errorHandler} = require("../heplers/dbErrorHandler");
const {stripHtml} = require("string-strip-html")
const fs = require('fs')

//models
const Blog = require("../models/blogModel");
const Category = require("../models/categoryModel");
const Tag = require("../models/tagModel");

//creating blog
exports.createBlog = (req,res) =>{
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
            blog.slug=slugify(title).toLowerCase()
            blog.mtitle = `${title} | Blog`
            blog.mdesc = stripHtml(body.substring(0,160)).result;
            blog.postedBy = req.user._id

            if(files.photo){
                if(files.photo.size > 1000000){
                    return res.statsu(400).json({
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
                return res.status(201).json({
                    status:true,
                    blog:result
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