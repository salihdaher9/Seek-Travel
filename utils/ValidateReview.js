
const Joi = require("joi");
const ExpressError = require("./ExpressError")


const validateReviewsScema = (req,res,next)=> {
  const ReviewSchemaJoi=Joi.object({
    review:Joi.object({
      body : Joi.string().required(),
      rating:Joi.number().required()
    }).required()
  })
  const result = ReviewSchemaJoi.validate(req.body);

  if (!result.error) {
    next();
  } 
  else{
  const msg = result.error.details.map((el) => el.message).join(" ");
  throw new ExpressError(msg+(": review middlewear"), 400);
}


}

module.exports = validateReviewsScema;
