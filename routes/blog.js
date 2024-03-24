const express = require('express')
const Blog = require('../models/blog')
const comment = require('../models/comment')
const multer = require('multer')
const path = require('path')
const router = express.Router()


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,`C:/Summer Vaction/Node.js/Node Project/Blogging web app/public/uploads`)
    },
    filename: function (req, file, cb) {
      const filename = `${Date.now()}-${file.originalname}`
      cb(null,filename)
    }
  })
  
  const upload = multer({ storage: storage })

  
router.get('/add-blog',(req,res)=>{
    return res.render('addblog',{
        user:req.user
    })
})

router.post('/add-blog',upload.single('coverImageURL'),async (req,res)=>{
    const {title,body} =req.body;
   const blog = await Blog.create({
        body,
        title,
        createdBy:req.user._id,
        coverImageURL:`/uploads/${req.file.filename}`
    })
    return res.redirect(`/blog/${blog._id}`)
})

router.post('/comment/:blogId',async (req,res)=>{
    const Comment = await comment.create({
      content:req.body.content,
      blogId:req.params.blogId,
      createdBy:req.user._id
    })

    return res.redirect(`/blog/${req.params.blogId}`)
})


router.get('/:id',async (req,res)=>{
    const blog = await Blog.findById(req.params.id).populate('createdBy')
    const Comments = await comment.find({blogId:req.params.id}).populate('createdBy')
    return res.render("blog",{
        user:req.user,
        blog,
        Comments,
    }); 
})

module.exports = router