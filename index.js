import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import AuthRoutes from './routes/Auth.js';
import DbCon from './db/db.js';
import MessageRoutes from './routes/Messages.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development'; // Default to 'development'
const app = express();

// db connection 
DbCon();

app.use(express.json());
app.use(express.static('public'));
app.use(cors());

app.use('/api/Auth', AuthRoutes);
app.use('/api/messages', MessageRoutes);

if (NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, './Frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './Frontend/dist', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

// Create HTTP Server
const server = createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: '*', // Update with your frontend domain for production
    methods: ['GET', 'POST'],
  },
});


 
let users=[]
const Addusers=(userId,socketId)=>{
  !users.some((user)=>user.userId===userId)&&
  users.push({userId, socketId})
}
const ReomveUser=(socketId)=>{
  users=users.filter((user)=>user.socketId!==socketId)
}
const GetUser=(userId)=>{
  return users.find((user)=>user.userId===userId)
}
io.on('connection', (socket) => {
  console.log('A user connected', socket.id);

  // Add user to the list when connected
  socket.on('AddUserSocket', (userId) => {
    if (userId) {
      Addusers(userId, socket.id);
      io.emit('getUsers', users);
      console.log('Current Users:', users);
    }
  });

  // Handle message sending
  socket.on('sendMessage', ({ messagedata }) => {
    const { receiverId } = messagedata;
    const targetUser = GetUser(receiverId); // Find the target user by ID

    if (targetUser) {
      io.to(targetUser.socketId).emit('receiveMessage', messagedata);
    }
  });

  // Remove user from the list when disconnected
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
    ReomveUser(socket.id);
    io.emit('getUsers', users);
  });
});


// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${NODE_ENV} mode`);
});
