// require('dotenv').config({path:'./env'}); // Load environment variables from .env file
import dotenv from 'dotenv';
import connectDB from './db/db.js';
import { app } from './app.js';

dotenv.config({ 
   path: './env'
 }); // Load environment variables from .env file

connectDB()
.then(() => {
   console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
} ) .catch((error) => {
   console.error('Database connection failed:', error);
   process.exit(1); // Exit process with failure
} );


app.listen(process.env.PORT, () => {
   console.log(`Server is running on port ${process.env.PORT}`)
})