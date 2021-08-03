// ************* This is the main server file  ***********
const express = require("express");
const cors = require("cors");
const app = express()
const options = {  cors: {
    origin: "https://lfgamer.gg",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }};
const { PORT } = require("./config");
const apiRouter = require("./routes");
const signupRouter = require('./routes/signup');
const loginRouter = require('./routes/login');
const setupRouter = require('./routes/setup');
const profileRouter = require('./routes/profile');
const duoRouter = require('./routes/duo');
const conversationRouter = require('./routes/conversations');
const messageRouter = require('./routes/messages')
const { getUser } = require("./models/messages");



app.use(cors())
app.use(express.json()) // use middleware to parse the request body to a JSON object so we can access the data.
app.use("/", apiRouter) // This can be split into a ton of sub-routes
app.use("/signup", signupRouter)
app.use("/login", loginRouter)
app.use("/setup", setupRouter)
app.use("/profile", profileRouter)
app.use("/duo", duoRouter)
app.use("/conversation", conversationRouter);
app.use("/message", messageRouter);
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, options);






















// Socket.io implementation

// app.listen(PORT, () => {
//     console.log(`LFGamer REST API listening @ http://localhost:${PORT}`)
// })
let users = [];

const addUser = (userId, socketId) => {
  !users.some(user => user.userId === userId) && users.push({userId,socketId})
}
const removeUser = (socketId) => {
  users = users.filter(user=> user.socketId !== socketId);
  return users;
}
const getUserId = (userId) => {
  console.log(users);
  return users.find(user => user.userId == userId);
}

io.on("connection", (socket) => {
  // when connect
  console.log('a user connected!');
  // take userId and socketId from user session
  socket.on("addUser", userId=> {
    addUser(userId, socket.id)
    io.emit("getUsers", users)
  })
  // send and get message
  socket.on("send-message", async ({senderId, receiverId, conversationId, text, created_at}) => {
    console.log(receiverId);
    const user = getUserId(receiverId);
    console.log(user);
    // database call to get user information to add to message to feed the app data?
    const userInfo = await getUser({id: senderId});
    const userSentMessage = {
      username: userInfo.username,
      avatar: userInfo.avatar,
      discord_id: userInfo.discord_id,
      conversationId,
      senderId,
      text,
      created_at
    }
    console.log(userSentMessage);
    io.to(user.socketId).emit("getMessage", userSentMessage)
  })
  
  socket.on('typing', (userTyping) => {
    const user = getUserId(Number(userTyping.receiverId));
    console.log('filtered typing user', user);
    if(typeof user === 'undefined') return;
    io.to(user.socketId).emit("typing", true)
  })
  socket.on("disconnect", () => {
    // when disconnect
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users)

  })
  });

httpServer.listen(`${PORT}`);
