import Joi from "joi";

const read = Joi.object({
  pageNo: Joi.number().integer().required(),
});

export default { read };
