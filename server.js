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

//Route to check if the server is working
app.get("/", (req, res) => {
    res.json("Working");
})

// Route to view all schools
app.put("/tasks/:id", async (req, res) => {
    const { id } = req.params;
    const { ...allData } = req.body;

    try {
        const response = await tasksSchemaModel.findOneAndUpdate(
            { _id: id },
            { $set: allData },
            { new: true }
        );

        if (response !== null) {
            res.status(200).json(response);
        } else {
            res.status(400).json("Task could not edit");
        }
    } catch (error) {
        console.log("Internal server error due to :-", error);
        res.status(500).json("Internal server error");
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