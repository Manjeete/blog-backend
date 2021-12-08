const { default: slugify } = require("slugify");
const Tag = require("../models/tagModel");
const {errorHandler} = require("../heplers/dbErrorHandler");
const Blog = require("../models/blogModel");

//create category
exports.create = async(req,res) =>{
    try{
        const {name} = req.body
        let slug = slugify(name).toLowerCase()

        let tag = await Tag.create({name,slug})
        res.status(201).json({
            status:true,
            tag,
            msg:"Tag created."
        })

    }catch(err){
        console.log(err)
        return res.status(500).json({
            status:false,
            msg:errorHandler(err)
        })
    }
}

//get all category
exports.getAll = async(req,res) =>{
    const tag = await Tag.find();
    res.status(200).json({
        status:true,
        tag
    })
}

//get one category by slug
exports.getOne = async(req,res) =>{
    try{
        const tag = await Tag.findOne({slug:req.params.slug});
        if (!tag){
            return res.status(404).json({
                status:false,
                msg:"Tag not found with thid slug"
            })
        }
        let blogs = await Blog.find({tags:tag})
                    .populate('categories','_id name slug')
                    .populate('tags','_id name slug')
                    .populate('postedBy','_id name')
                    .select('_id title slug excerpt categories postedBy tags createdAt updatedAt')
        res.status(200).json({
            status:true,
            tag,
            blogs
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            status:false,
            msg:errorHandler(err)
        })
    }
}

//delete category by slug (Only for admin)
exports.deleteOne = async(req,res) =>{
    try{
        const tag = await Tag.findOneAndDelete({slug:req.params.slug})
        res.status(200).json({
            status:true,
            msg:"Tag deleted."
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            status:false,
            msg:errorHandler(err)
        })
    }
}