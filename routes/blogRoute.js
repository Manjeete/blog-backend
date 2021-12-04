const express = require('express');
const blogController = require("../controllers/blogController");
const authController = require("../controllers/authController");

const router = express.Router();

router
    .route('/')
    .post(
        authController.requireSignin,
        authController.adminMiddleware,
        blogController.createBlog
    )

router.get("/",blogController.getListBlogs)
router.post("/blogs-categories-tags",blogController.getListBlogsCatsTags)
router
    .route("/:slug")
    .get(blogController.getOneBlog)
    .delete(
        authController.requireSignin,
        authController.adminMiddleware,
        blogController.deleteOneBlog
    )
    .patch(
        authController.requireSignin,
        authController.adminMiddleware,
        blogController.updateOneBlog
    )

module.exports = router;