const express = require('express')
const app = express()
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')

require('dotenv').config()



app.use(cors({ origin: "*" }))
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    }
})

server.listen(process.env.SERVER_PORT, process.env.SERVER_HOST, () => {
    console.log('Server is running...')
})

exports.io = io
