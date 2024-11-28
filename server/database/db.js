const pool = require('./config')
const { createDate, checkCode, encodePassword } = require('./../utils')

async function createRoomName(){
    const lastRow = await pool.query('SELECT id FROM rooms')
    if(lastRow.rows.length){
        return `${lastRow.rows.length + 1}`
    }
    return '1'
};
async function createRoom(userData){
    const code = await encodePassword(userData.code)
    const room = await createRoomName()
    const time = createDate(userData.time)
    await pool.query(`INSERT INTO rooms (room, code, lifetime) VALUES('${room}', '${code}', '${time}')`)
    userData.time = time
    userData.room = room
    return userData
};
async function deleteRoom(room){
    await pool.query(`DELETE FROM rooms WHERE id = '${room}'`)
};
async function deleteUser(session){
    await pool.query(`DELETE FROM users WHERE encode_name = '${session}'`)
};
async function createUser(userData){
    try{
        const encodeUserName = await encodePassword(`${userData.name} ${userData.room}`)
        const room = await pool.query(`SELECT id FROM rooms WHERE room = '${userData.room}'`)
        userData.encodeUserName = encodeUserName
        await pool.query(`INSERT INTO users (name, room_id, encode_name) VALUES('${userData.name}', ${room.rows[0].id}, '${encodeUserName}')`)
    }
    catch(error){
        return {'error': 'This name is already in use.'}
    }
};
async function getCurrentRoom(session){
    const response = await pool.query(`select us.name, rm.room, rm.lifetime, rm.code, rm.id from users us join rooms rm on rm.id = us.room_id where us.encode_name = '${session}'`)
    return response.rows[0]
}
async function checkActiveRoom(session, delUser){
    const response = await getCurrentRoom(session)
    delUser && await deleteUser(session)
    try{
        const roomOnline = await pool.query(`SELECT us.name FROM users us join rooms rm on us.room_id = rm.id WHERE rm.code = '${response.code}'`)
        const time = response ? response.lifetime : new Date(2023, 1, 1)
        if(!(new Date() < time)){
            return deleteRoom(response.id)
        }
        return {
            online: roomOnline.rows,
            currentUser: response.name,
            room: response.room,
            roomCode: response.code,
            lifetime: response.lifetime
        }
    }
    catch(error){
        console.log('Ошибка при checkActiveRoom', error)
    }
}
async function checkRoom(userData){
    try{
        const currentRoom = await pool.query(`SELECT code, lifetime FROM rooms WHERE room = '${userData.room}'`)
        const room = await checkCode(currentRoom.rows[0].code, userData.code)
        if(!room){
            userData.error = "The entered data doesn't match."
            return userData
        }
        userData.time = currentRoom.rows[0].lifetime
        const user = await createUser(userData)
        if(user) return user
        const time = await checkActiveRoom(userData.encodeUserName)
        if(time) return time
    }
    catch(error){
        userData.error = "The entered room doesn't exist."
    }
    finally{
        return userData
    }
};

async function checkUser(userData){
    const room = await createRoom(userData)
    const user = await createUser(room)
    if(user) return user
    return room
};

exports.checkUser = checkUser
exports.checkRoom = checkRoom
exports.deleteUser = deleteUser
exports.checkActiveRoom = checkActiveRoom
exports.getCurrentRoom = getCurrentRoom