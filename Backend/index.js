import express from 'express';
import connectDB from './src/database/database.config.js';
import app from './app.js';
import  cloudinary from "cloudinary";

const port = 3000 || process.env.PORT;

                              
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET 
  
});

connectDB()

.then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    })
})

.catch((error) => {
    console.log(" error while connecting server in index.js file ", error);
})
