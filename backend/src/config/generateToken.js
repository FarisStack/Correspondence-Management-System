const jwt = require("jsonwebtoken");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_AUTH_SECRET, {
        expiresIn: "30d",
    });
};

export default generateToken;