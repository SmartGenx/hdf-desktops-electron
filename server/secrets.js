require('dotenv').config();

const dotenv = require('dotenv');
dotenv.config({ path: '.env' });

const PORT = process.env.PORT;
const JWT_SECRET = "bvhdbvsbvjksbksvvns";

module.exports = { PORT, JWT_SECRET };
