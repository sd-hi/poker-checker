import Joi from 'joi';

const register = Joi.object({
    name: Joi.string().max(30), // Limit name to 30 characters

    email: Joi.string().email().required(), // Validate address is formatted as email

    password: Joi.string().min(6).required(), // Password is required and must be at least 6 characters
});

const login = Joi.object({
    email: Joi.string().email().required(), // Email is used as username

    password: Joi.string().required(),
});

export default { register, login };
