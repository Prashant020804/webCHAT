import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors'
import AuthRoutes from './routes/Auth.js';
import DbCon from './db/db.js';
import MessageRoutes from './routes/Messages.js';


// Load environment variables
dotenv.config();


const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development'; // Default to 'development'
const app = express();

// db connection 
DbCon()
app.use(express.json());
app.use(express.static('public'))
app.use(cors())

app.use('/api/Auth',AuthRoutes)
app.use('/api/messages', MessageRoutes)
if (NODE_ENV === 'production') {
  // Serve the frontend build folder
  const __dirname = path.resolve(); // Resolve the current directory
  app.use(express.static(path.join(__dirname, './Frontend/dist'))); // Adjust if your build folder is named differently

  // Serve index.html for any route
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './Frontend/dist', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${NODE_ENV} mode`);
});
