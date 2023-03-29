const express=require('express');
const router=express.Router();
const catchAsync=require('../utilities/catchAsync');
const passport=require('passport');
const User=require('../models/users');


router.get('/register',(req,res)=>{
    res.render('users/register');
})

router.post('/register',catchAsync(async(req,res)=>{
    try {
        const {email,username,password}=req.body;
        const user=new User({email,username});
        const registeredUser= await User.register(user,password);
        req.login(registeredUser,(err)=>{
            if(err) return next(err);
            req.flash('success','welcome to yelpcamp!');
            res.redirect('/campgrounds');
        })   
    } catch (e) {
            req.flash('error',e.message)
            res.redirect('/register');
    }
}))

router.get('/login',(req,res)=>{
    res.render('users/login');
})

router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),(req,res)=>{
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
    // console.log(req.session.returnTo);
    // req.flash('success','welcome back  !!' );
   
    // const redirectUrl=req.session.returnTo || '/campgrounds';
    // // delete req.session.returnTo;
    // console.log(redirectUrl);
    // res.redirect(redirectUrl);
})

router.get('/logout', (req, res) => {
    req.logout(function (error){
        if(error)
        {
            console.log("axghjk");
            return next(error);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
   
})

// router.get('/logout' ,(req,res)=>{
//     req.logout();
//     req.flash('success','good bye !!');
//     res.redirect('/campgrounds');
// })

module.exports=router;