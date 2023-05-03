import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import AuthRoute from './Routes/v1/AuthRoute.js';
import UserRoute from './Routes/v1/UserRoute.js';
import RecipeRoute from './Routes/v1/RecipeRoute.js';
import PostRoute from './Routes/v1/PostRoute.js';
import UploadRoute from './Routes/v1/UploadRoute.js';
import ChatRoute from './Routes/v1/ChatRoute.js';
import MessageRoute from './Routes/v1/MessageRoute.js';
//import AppError from './utils/appError.js';

//Routes
//Middleware

import http from 'http';
import { Server } from 'socket.io';

const app = express();

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

app.use(express.json());
app.use(cors());
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));

//useage of route
app.use('/api/v1/auth', AuthRoute);
app.use('/api/v1/user', UserRoute);
app.use('/api/v1/recipe', RecipeRoute);
app.use('/api/v1/posts', PostRoute);
app.use('/api/v1/upload', UploadRoute);
app.use('/api/v1/chat', ChatRoute);
app.use('/api/v1/message', MessageRoute);

let activeUsers = [];

io.on('connection', (socket) => {
  console.log('client connected');
  // add new User
  socket.on('new-user-add', (newUserId) => {
    // if user is not added previously
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({ userId: newUserId, socketId: socket.id });
      //console.log("New User Connected", activeUsers);
    }
    // send all active users to new user
    io.emit('get-users', activeUsers);
  });

  // send message to a specific user
  socket.on('send-message', (data) => {
    const { receiverId } = data;
    const user = activeUsers.find((user) => user.userId === receiverId);
    console.log('Sending from socket to :', receiverId);
    console.log('Data: ', data);
    if (user) {
      io.to(user.socketId).emit('receive-message', data);
      console.log('user found', user);
    }
  });

  socket.on('disconnect', () => {
    // remove user from active users
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log('User Disconnected', activeUsers);
    // send all active users to all users
    io.emit('get-users', activeUsers);
  });
});

// app.all('*', (req, res, next) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
// });

httpServer.listen(8080, () => {
  console.log(`The server is running at port: 8080`);
});

export default app;
