// Load environment variables from .env file
require("dotenv").config();
// Import required libraries
const express = require("express");
const cors = require("cors");

// Define CORS options to allow cross-origin requests
const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
}
// Initialize express app
const app = express();
// Middleware configuration
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


//Route to check if the server is working
app.get("/", (req, res) => {
    res.json("Working");
})

// Start the server and listen on the specified port
app.listen(process.env.PORT, () => {
    console.log("App is listening on the Port :-", process.env.PORT);
})