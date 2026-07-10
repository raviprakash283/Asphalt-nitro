module.exports = (schema) => {
    return (req, res, next) => {
          console.log(req.body);
        try {
            schema.parse(req.body);
            console.log("in middleware")
            next();
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                error: error.errors
            });
        }
    };
};