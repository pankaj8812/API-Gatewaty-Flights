const express = require('express');
const rateLimit = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');

const { ServerConfig } = require('./config');
const { AuthRequestMiddlewares } = require('../src/middlewares')
const apiRoutes = require('./routes');

const app = express();

const limiter = rateLimit({
	windowMs: 2 * 60 * 1000, // 2 minutes
	max: 10, // Limit each IP to 10 requests per `window` (here, per 2 minutes)
});

       
app.use("/flightsService", // if the user gives us a request to /flightsService
    [AuthRequestMiddlewares.checkAuth, AuthRequestMiddlewares.isAdmin],
    createProxyMiddleware({
        target: ServerConfig.FLIGHT_SERVICE, //  We will redirect the request to the Flight Service' IP address -> `http://localhost:3000`
        changeOrigin: true,
        pathRewrite: {'^/flightsService' : '/'} 
    })
);
            
app.use(
    "/bookingService",
    [AuthRequestMiddlewares.checkAuth],
    createProxyMiddleware({
        target: ServerConfig.BOOKING_SERVICE,
        changeOrigin: true,
        pathRewrite: {'^/bookingsService': '/'}
    })
);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(limiter);
    
app.use('/api', apiRoutes);


app.listen(ServerConfig.PORT, () => {
    console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
});
