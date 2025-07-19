// require('dotenv').config({path:'./env'}); // Load environment variables from .env file
import dotenv from 'dotenv';
import connectDB from './db/db.js';


dotenv.config({ 
   path: './env'
 }); // Load environment variables from .env file

connectDB()