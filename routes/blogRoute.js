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
router.get("/search",blogController.listSearch)

// router
//     .route("/user")
//     .post(
//         authController.requireSignin,
//         authController.authMiddleware,
//         blogController.createBlog
//     )

// router
//     .route("/user/:slug")
//     .delete(
//         authController.requireSignin,
//         authController.authMiddleware,
//         blogController.deleteOneBlog
//     )
//     .patch(
//         authController.requireSignin,
//         authController.authMiddleware,
//         blogController.updateOneBlog
// )

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

router.get("/photo/:slug",blogController.blogPhoto)
router.post("/related",blogController.listRelatedBlogs)

//blog for auth users
router
    .route("/user")
    .post(
        authController.requireSignin,
        authController.authMiddleware,
        blogController.createBlog
    )

router.get("/:username/blogs",blogController.listByUser)
router
    .route("/user/:slug")
    .delete(
        authController.requireSignin,
        authController.authMiddleware,
        authController.canUpdateDeleteBlog,
        blogController.deleteOneBlog
    )
    .patch(
        authController.requireSignin,
        authController.authMiddleware,
        authController.canUpdateDeleteBlog,
        blogController.updateOneBlog
)

module.exports = router;