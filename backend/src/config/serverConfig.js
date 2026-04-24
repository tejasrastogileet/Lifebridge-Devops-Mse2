const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    PORT : process.env.PORT || 5000,
    JWT_SECRET : process.env.JWT_SECRET,
    OPENCAGE_API_KEY : process.env.OPENCAGE_API_KEY,
    ORS_API_KEY : process.env.ORS_API_KEY,
    MONGODB_URI : process.env.MONGODB_URI,
    NODE_ENV : process.env.NODE_ENV || 'development',
    FRONTEND_URL : process.env.FRONTEND_URL
}