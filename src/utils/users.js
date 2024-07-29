const users = []

//For adding user
const addUser = ({ id, username, room }) => {
    //Clean the data
    username: username.trim().toLowerCase()
    room: room.trim().toLowerCase()

    //Validate data
    if (!username || !room) {
        return {
            error: 'Username and room required!'
        }
    }

    //Check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    //Validating username
    if (existingUser) {
        return {
            error: 'Username is in use!'
        }
    }

    //Store user
    const user = { id,username,room }
    users.push(user)
    return { user }
}

//For removing user
const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id )
        
    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUsersinRoom = (room) => {
    return users.filter((user) => user.room === room)
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersinRoom
}