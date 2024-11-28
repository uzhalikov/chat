
const { io } = require('./socket/config.js')
const { checkUser, checkRoom } = require('./database/db')
const { createOrCheckRoom, connectRoom, sendMessage, loginOut } = require('./socket/listeners.js')

io.on('connection', (socket) => { 
    socket.on('createRoom', (userData) => {
        createOrCheckRoom(userData, checkUser, socket)
    });
    socket.on('checkRoom', (userData) => { 
        createOrCheckRoom(userData, checkRoom, socket)
    });
    socket.on('connectRoom', (session) => { 
        connectRoom(session, socket)
    });
    socket.on('sendMessage', (data) => {
        sendMessage(io, data)
    });
    socket.on('loginOut', (session) => {
        loginOut(session, socket)
    });
});