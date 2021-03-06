const { default: slugify } = require("slugify");
const Category = require("../models/categoryModel");
const {errorHandler} = require("../heplers/dbErrorHandler");
const Blog = require("../models/blogModel");

//create category
exports.create = async(req,res) =>{
    try{
        const {name} = req.body
        let slug = slugify(name).toLowerCase()

        let category = await Category.create({name,slug})
        res.status(201).json({
            status:true,
            category,
            msg:"Category created."
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
    const category = await Category.find();
    res.status(200).json({
        status:true,
        category
    })
}

//get one category by slug
exports.getOne = async(req,res) =>{
    try{
        const category = await Category.findOne({slug:req.params.slug});
        if (!category){
            return res.status(404).json({
                status:false,
                msg:"Category not found with thid slug"
            })
        }
        let blogs = await Blog.find({categories:category})
                    .populate('categories','_id name slug')
                    .populate('tags','_id name slug')
                    .populate('postedBy','_id name')
                    .select('_id title slug excerpt categories postedBy tags createdAt updatedAt')
        res.status(200).json({
            status:true,
            category,
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
        const category = await Category.findOneAndDelete({slug:req.params.slug})
        res.status(200).json({
            status:true,
            msg:"Category deleted."
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            status:false,
            msg:errorHandler(err)
        })
    }
}