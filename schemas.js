const Joi=require('joi')
module.exports.campgroundSchema=Joi.object(
    {
        campground:Joi.object({
            title:Joi.string().required(),
            price:Joi.number().required().min(0),
            image:Joi.string().required(),
            location:Joi.string().required(),
            description:Joi.string().required()
        }).required()
    }
)

module.exports.reviewSchema=Joi.object({
    review:Joi.object({
        rating:Joi.number().required(),
        body:Joi.string().required()


    }).required()

})
// const {error}=campgroundSchema.validate(req.body);
// if(error)
// {
//     const msg=error.details.map(el=>el.message).join(',')
//     throw new expressError(msg,400)
// }