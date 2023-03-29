const express=require('express');
const router=express.Router();
const Campground=require('../models/campgrounds');
const {campgroundSchema}=require('../schemas.js');
const catchAsync=require('../utilities/catchAsync');
const expressError=require('../utilities/expressError');
const {isLoggedIn ,isAuthor,validateCampground}=require('../middlewares');

router.get('/',catchAsync(async (req,res)=>{
    const campgrounds=await Campground.find({})
    res.render('campgrounds/index',{campgrounds})
}))

router.get('/new',isLoggedIn, catchAsync(async(req,res,next)=>{
    res.render('campgrounds/new')
}))


router.get('/:id',catchAsync(async (req,res,next)=>{
    try {
        const campground= await Campground.findById(req.params.id).populate({path:'reviews',populate:{
            path:'author'
        }
    }).populate('author')
        res.render('campgrounds/show',{campground})
        
    } catch (error) {
        next(error)
        
    }
}))

router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(async (req,res)=>{
    const campground=await Campground.findById(req.params.id);
    res.render('campgrounds/edit' ,{campground})
}))

router.post('/',isLoggedIn,validateCampground,catchAsync(async (req,res)=>{
   const camp=new Campground(req.body.campground)
   camp.author=req.user._id;
   await camp.save()
   req.flash('success','successfully made a campground');
   res.redirect(`/campgrounds/${camp._id}`);
}))

router.put('/:id',isLoggedIn,isAuthor,validateCampground,catchAsync(async(req,res)=>{
   const campground=await Campground.findByIdAndUpdate(req.params.id,{...req.body.campground})
   req.flash('success','successfully updated campground');
   res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:id',isLoggedIn ,isAuthor,catchAsync(async(req,res)=>{
    await Campground.findByIdAndDelete(req.params.id)
    res.redirect('/campgrounds')
}))

module.exports=router;