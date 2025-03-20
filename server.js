// Load environment variables from .env file
require("dotenv").config();
// Import required libraries
const express = require("express");
const cors = require("cors");

// Import custom modules
const ConnectDB = require("./src/config/db");
const schoolsSchemaModel = require("./src/models/schools");

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

// Establish database connection
ConnectDB();

// Haversine formula to calculate distance
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
};

//Route to check if the server is working
app.get("/", (req, res) => {
    res.json("Working");
})

// Route to view all schools
app.get("/listSchools/:latitude/:longitude", async (req, res) => {
    const { latitude, longitude } = req.params;
    if (!latitude || !longitude) {
        return res.status(400).json({ error: "Latitude and longitude are required." });
    } else {
        try {
            const userLat = parseFloat(latitude);
            const userLon = parseFloat(longitude);

            const response = await schoolsSchemaModel.find();
            if (response !== null) {
                const schoolsWithDistance = response.map((school) => ({
                    ...school.toObject(),
                    distance: calculateDistance(userLat, userLon, school.latitude, school.longitude)
                }));
                
                //Find and returns nearby schools under 10km
                const nearbySchools = schoolsWithDistance.filter(school => school.distance <= 10);
                res.json(nearbySchools);

            } else {
                res.status(400).json("Schools not available");
            }
        } catch (error) {
            console.log("Internal server error due to :-", error);
            res.status(500).json("Internal server error");
        }
    }
})

// Route to add new schools
app.post("/addSchool", async (req, res) => {
    const { name, address, latitude, longitude } = req.body;
    const datas = {
        name: name,
        address: address,
        latitude: latitude,
        longitude: longitude
    }

    //Validating input data and insert into database
    if ((name !== undefined, address !== undefined, latitude !== undefined, longitude !== undefined) &&
        (typeof name === "string", typeof address === "string", typeof latitude === "number", typeof longitude === "number")) {
        try {
            const response = await schoolsSchemaModel.insertMany([datas]);
            if (response !== null) {
                res.status(200).json(response);
            } else {
                res.status(400).json("School could not add");
            }
        } catch (error) {
            console.log("Internal server error due to :-", error);
            res.status(500).json("Internal server error");
        }
    } else {
        res.status(500).json("Data incomplete or data type is not accurate");
    }
})

// Start the server and listen on the specified port
app.listen(process.env.PORT, () => {
    console.log("App is listening on the Port :-", process.env.PORT);
})