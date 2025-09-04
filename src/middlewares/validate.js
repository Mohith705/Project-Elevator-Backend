import httpStatus from 'http-status';

const validate = (schema) => (req, res, next) => {
    const validSchema = ['params', 'query', 'body'].reduce((acc, key) => {
        if (schema[key]) acc[key] = schema[key];
        return acc;
    }, {});

    const object = ['params', 'query', 'body'].reduce((acc, key) => {
        acc[key] = req[key];
        return acc;
    }, {});

    const { value, error } = validSchema.body
        ? validSchema.body.validate(object.body, { abortEarly: false, stripUnknown: true })
        : { value: object.body };

    if (error) {
        const message = error.details.map((d) => d.message).join(', ');
        return res.status(httpStatus.BAD_REQUEST).json({ message });
    }
    req.body = value;
    next();
};

export default validate;
