const express = require('express');
const bodyParser = require('body-parser');
const { PORT } = require('./config/serverConfig');
const v1Routes = require('./routes/index');
const dbConnect = require('./config/db');
const cors = require("cors");
const validateEnv = require('./config/validateEnv');

setUpAndStartServer = () => {

    validateEnv();
    if (process.env.SKIP_DB === 'true') {
        console.log('Skipping database connection (SKIP_DB=true)');
    } else {
        dbConnect();
    }
    const app = express();
    
    // CORS configuration for local and deployed frontend
    const allowedOrigins = [
        "http://localhost:3000",
        "https://lifebridge-devops-mse2.vercel.app"
    ];

    app.use(cors({
        origin: allowedOrigins,
        credentials: true
    }));
    
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));

    app.get('/', (req, res) => {
        return res.status(200).json({ status: 'ok' });
    });

    app.get('/health', (req, res) => {
        return res.status(200).json({ status: 'ok' });
    });

    app.use('/api',v1Routes)

    app.listen(PORT , async()=> {
        console.log("Server started on PORT ",PORT);
        console.log("CORS enabled for:", allowedOrigins.join(", "));
    })
}

setUpAndStartServer();