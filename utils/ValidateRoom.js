const Joi = require("joi");
const ExpressError = require("./ExpressError");

const validateRoomScema = (req, res, next) => {
  const RoomScema = Joi.object({
    review: Joi.object({
      type: Joi.string().required(),
      description: Joi.string().required(),
      price: Joi.number().required(),
      pictures: Joi.array().required(),
      max: Joi.number().required(),
      currentCounter: Joi.number().required(),
      calender: Joi.array().required(),
    }).required(),
  });
  const result = RoomScemaJoi.validate(req.body);

  if (!result.error) {
    next();
  } else {
    const msg = result.error.details.map((el) => el.message).join(" ");
    throw new ExpressError(msg + ": review middlewear", 400);
  }
};

module.exports = validateRoomScema;

