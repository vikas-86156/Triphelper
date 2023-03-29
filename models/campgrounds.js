const mongoose= require('mongoose');
const Review=require('./review');
const User=require('./users');
const Schema=mongoose.Schema;

const campgroundSchema=new Schema({
    title:{type:String},
    price:{type:Number},
    image:String,
    description:String,
    location:String,
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[
        {
        type:Schema.Types.ObjectId,
        ref:'Review'
        }

    ]
})

campgroundSchema.post('findOneAndDelete',async function (doc){
    if(doc)
    {
        await Review.deleteMany({_id:{
            $in: doc.reviews
        }})
    }
})

// const mongoose = require('mongoose');
// const Review = require('./review')
// const Schema = mongoose.Schema;

// const CampgroundSchema = new Schema({
//     title: String,
//     image: String,
//     price: Number,
//     description: String,
//     location: String,
//     reviews: [
//         {
//             type: Schema.Types.ObjectId,
//             ref: 'Review'
//         }
//     ]
// });

module.exports=mongoose.model('campground',campgroundSchema);

