import { asyncHandler } from '../utils/asynchandeler.js';

export const registerUser = asyncHandler(async (req, res)=> {
   // Your code here to register a user
    res.status(200).json({ message: 'User registered successfully'});
});

