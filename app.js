const express = require('express')
const path = require('path')
const userRouter = require('./routes/user')
const { connectMongodb } = require('./connection')
const blogRouter = require('./routes/blog')
const {checkForAuthenticationCookie} = require('./middlewares/authentication')
const cookieParser = require('cookie-parser')
const Blog =require('./models/blog')
require('dotenv').config();
const app = express()
const mongourl = process.env.MONGO_URL;
const PORT = process.env.PORT ||3000;



//Connection
connectMongodb(mongourl).then(() => {
    console.log("MongoDb Connected..")
}).catch((err) => {
    console.log("Found an Error While connection", err)
})

//Middlewares
app.set('view engine','ejs')
app.set('views',path.resolve("./views"))
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(checkForAuthenticationCookie('token'))
app.use(express.static(path.resolve('./public')))

//Routing Requests
app.get('/',async(req,res)=>{
    const allblogs = await Blog.find({})
    res.render('home',{
        user:req.user,
        blogs:allblogs
    })
})

app.use('/user',userRouter);
app.use('/blog',blogRouter)
app.listen(PORT,()=>{
    console.log(`server running on ${PORT}`)
})