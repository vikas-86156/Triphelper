const mongoose=require('mongoose')
const cities=require('./cities');
const {places,descriptors}=require('./seedhelper')


const campground=require('../models/campgrounds');

mongoose.set('strictQuery',false)
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp',{
    useNewUrlParser:true,
    // useCreateIndex:true,
    useUnifiedTopology:true
})

const sample=(array)=>{
    return array[Math.floor(Math.random()*array.length)]
}

const seedDb=async()=>{
    await campground.deleteMany({})
    for( i=0;i<50;i++)
    {
        const random=Math.floor(Math.random()*1000)
        const camp=new campground({
            location:`${cities[random].city},${cities[random].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image:'https://source.unsplash.com/collection/483251',
            author:'6419a0c16a5854307462bf17',
            price:Math.floor(Math.random()*20),
            description:'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Libero, ab alias doloribus omnis recusandae architecto porro accusantium ut aliquam sint pariatur '
        })
        await camp.save()
    }



}
seedDb()