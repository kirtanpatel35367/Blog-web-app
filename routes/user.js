const express = require('express')
const User = require('../models/user')
const router = express.Router()

router.get('/signin',(req,res)=>{
    return res.render('signin')
})

router.get('/signup',(req,res)=>{
    return res.render('signup')
})

router.post('/signin',async (req,res)=>{
    const {email,password}=req.body;
    // const user = User.MatchPasswordAndGenerateToken(email,password);
    try {
        const token = await User.MatchPasswordAndGenerateToken(email,password);
        return res.cookie("token",token).redirect('/');
    } catch (error) {
        return res.render("signin",{
            error:"Incorrect Email and Password"
        })
    }

})


router.post('/signup',async (req,res)=>{
    const {fullname,email,password}=req.body;
    await User.create({
        fullname,
        email,
        password,
    })

    return res.render('signin')
})

router.get("/logout",(req,res)=>{
    return res.clearCookie('token').redirect('/')
})


module.exports = router;