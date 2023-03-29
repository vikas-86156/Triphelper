const express=require('express')
const app=express()
const mongoose=require('mongoose')
const path=require('path')
const methodOveride=require('method-override')
const ejsMate=require('ejs-mate');
const campgrounds=require('./routes/campgrounds');
const reviews=require('./routes/reviews');
const session=require('express-session');
const flash=require('connect-flash');
const passport=require('passport');
const User=require('./models/users');
const localStrategy=require('passport-local');
const userRoutes=require('./routes/user');

// const Campground=require('./models/campgrounds')
// const Review=require('./models/review')
// const catchAsync=require('./utilities/catchAsync');
// const expressError=require('./utilities/expressError');
// const {campgroundSchema,reviewSchema}=require('./schemas.js')




mongoose.set('strictQuery',false)
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp',{
    useNewUrlParser:true,
    // useCreateIndex:true,
    useUnifiedTopology:true,
})
.then(()=>{
    console.log("connection open ...")

})
.catch((err)=>{
    console.log(err)
    console.log("error")
})

app.engine('ejs',ejsMate);
app.use(methodOveride('_method'))
app.use(express.urlencoded({extended :true}))
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use(express.static(path.join(__dirname,'public')))


const sessionConfig={
    secret:"thisshouldbeabettersecret",
    resave:false,
    saveUninitialized: true,
    cookie:{
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*7*24
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    // console.log(req.session);
    // console.log(req.originalUrl);
    res.locals.currentUser=req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
})

app.use('/', userRoutes);
app.use('/campgrounds',campgrounds);
app.use('/campgrounds/:id/reviews',reviews);

app.all('*',(req,res,next)=>
{
    next(new expressError('page not found',404))
})

app.use((error,req,res,next)=>
{
    const {statusCode=500,message='something went wrong'}=error
    res.status(statusCode).send(message);
})
app.listen(3000,(req,res)=>{
    console.log("server is up and running ")
})



// const validateCampground=(req,res,next)=>{
//     const {error}=campgroundSchema.validate(req.body);
//     if(error)
//     {
//         const msg=error.details.map(el=>el.message).join(',')
//         throw new expressError(msg,400)
//     }else{
//         next()
//     }
// }

// const validateReview=(req,res,next)=>{
//     const {error}=reviewSchema.validate(req.body);
//     if(error)
//     {
//         const msg=error.details.map(el=>el.message).join(',');
//         throw new expressError(msg,400);
//     }
//     else
//     {
//         next()
//     }
// }


// app.use('/campgrounds',campgrounds);
// app.use('/campgrounds/:id/reviews',reviews);

// app.all('*',(req,res,next)=>
// {
//     next(new expressError('page not found',404))
// })

// app.use((error,req,res,next)=>
// {
//     const {statusCode=500,message='something went wrong'}=error
//     res.status(statusCode).send(message);
// })
// app.listen(3000,(req,res)=>{
//     console.log("server is up and running ")
// })

// app.get('/campgrounds', catchAsync(async (req,res)=>{
//     const campgrounds=await Campground.find({})
//     // console.log(campgrounds)
//     res.render('campgrounds/index',{campgrounds})
// }))

// app.get('/campgrounds/new',catchAsync(async(req,res)=>{
//     res.render('campgrounds/new')
// }))


// app.get('/campgrounds/:id',catchAsync(async (req,res,next)=>{
//     try {
//         const campground= await Campground.findById(req.params.id).populate('reviews')
//         res.render('campgrounds/show',{campground})
        
//     } catch (error) {
//         next(error)
        
//     }
// }))
// app.get('/campgrounds/:id/edit',catchAsync(async (req,res)=>{
//     const campground=await Campground.findById(req.params.id);
//     res.render('campgrounds/edit' ,{campground})
// }))

// app.post('/campgrounds',validateCampground,catchAsync(async (req,res)=>{
//    const camp=new Campground(req.body.campground)
//    await camp.save()
//    res.redirect('/campgrounds')
// }))

// app.put('/campgrounds/:id',validateCampground,catchAsync(async(req,res)=>{
//    const campground=await Campground.findByIdAndUpdate(req.params.id,{...req.body.campground})
//    res.redirect(`/campgrounds/${campground._id}`)
// }))

// app.delete('/campgrounds/:id' ,catchAsync(async(req,res)=>{
//     await Campground.findByIdAndDelete(req.params.id)
//     res.redirect('/campgrounds')
// }))

// app.post('/campgrounds/:id/reviews',validateReview,catchAsync(async(req,res)=>{
//     const campground=await Campground.findById(req.params.id);
//     const review=new Review(req.body.review);
//     campground.reviews.push(review);
//     await review.save();
//     await campground.save();
//     res.redirect(`/campgrounds/${campground._id}`);
// }))

// app.delete('/campgrounds/:id/reviews/:reviewId',catchAsync(async(req,res)=>{
//     const{id, reviewId}= req.params;
//     await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
//     await Review.findByIdAndDelete(reviewId);
//     res.redirect(`/campgrounds/${id}`);
// }))

// app.all('*',(req,res,next)=>
// {
//     next(new expressError('page not found',404))
// })

// app.use((error,req,res,next)=>
// {
//     const {statusCode=500,message='something went wrong'}=error
//     res.status(statusCode).send(message);
// })
// app.listen(3000,(req,res)=>{
//     console.log("server is up and running ")
// })