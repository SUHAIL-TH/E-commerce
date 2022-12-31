const express =require('express')
const path=require('path')
const session=require("express-session")
const cookiparser=require('cookie-parser')
var db=require('./confi/connection')
const hbs=require('express-handlebars')
const fileupload=require('express-fileupload')
const userRouter=require('./routes/user')
const adminRouter=require('./routes/admin')


const app=express()


//view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs',hbs.engine({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views/layout',partialsDir:__dirname+'/views/partials'}))

app.use(session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: 6000000 },
    resave: false 
}));
app.use(express.static(__dirname));
app.use("javascript",express.static(path.join(__dirname+"public/js/main.js")));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookiparser());
app.use(fileupload())

db.connect((err)=>{
    if(err) console.log("connection error");

    else console.log("database connected ");
})
app.use('/',userRouter);
app.use('/admin',adminRouter);
app.get('*',(req,res)=>{
    res.render('user/404',{admin:false,user:false})
})









//prevent storing of cache
app.use((req, res, next) => {
    res.set(
        "Cache-Control",
        "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    next();
})


//write cheyyanam athinte code above of the  below code
app.listen(4000,()=>{
    console.log('server conneted ')
})
