require('dotenv').config();
const express = require('express');
const app = express();
const { rateLimit } = require('express-rate-limit')
const cors = require('cors');
const PORT = process.env.BACKEND_PORT;
const user = require('./Router/userRoute.js');

app.use(cors({
    origin: 'http://127.0.0.1:3000',
    credentials: true
}));

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
	// store: ... , // Redis, Memcached, etc. See below.
})

app.use(limiter);

app.use(express.json());

app.use('/api/users', user);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})


