import express from 'express';
import dotenv from 'dotenv';
//importing the database connection function
import main from './Config/dbConnection.js';
 
// Load environment variables from the .env file
dotenv.config();

// Create an instance of the Express application
const app = express();

// Start the server and listen on a specified port
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  main();
});

// Define a simple route for testing
// app.get('/', (req, res) => {
//   res.send('Hello, World!');
// });