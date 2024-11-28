const { runAsync } = require('./../utils')
const { checkActiveRoom, getCurrentRoom } = require('./../database/db')

exports.createOrCheckRoom = (userData, func, socket) => {
    runAsync(userData, func).then(result => {
        socket.emit('message', {
            message: {
                'from': 'system',
                'text': result
            }
        })
    })
}
exports.loginOut = (session, socket) => {
    socket.emit('loginOutSuccess', 'success')
    checkActiveRoom(session, true).then((response) => {
        socket.broadcast.to(response.roomCode).emit('updateOnlineRoom', { 
            message: {
                'from': 'system',
                'text': response
            }
        })
        socket.to(response.roomCode).emit('chatMessage', {
            message: {
                'from': 'system',
                'type': 'message',
                'text': 'Кто-то покинул чат'
            }
        })
    })

}
exports.connectRoom = (session, socket) => {
    runAsync(session, checkActiveRoom).then(result => {
        if(result){
            socket.join(result.roomCode)
            const message = {
                'from': 'system',
                'text': result
            }
            socket.emit('initialMessage', {'message': message})
            socket.broadcast.to(result.roomCode).emit('updateOnlineRoom', {'message': message})
        }
        else{
            socket.emit('loginOutSuccess', 'success')
        }
    })
}
exports.sendMessage = (io, data) => {
    runAsync(data.session, getCurrentRoom).then(result => {
        io.to(result.code).emit('chatMessage', {
            message: {
                'from': result.name,
                'type': 'message',
                'text': data.message
            }
        })
    })

}
