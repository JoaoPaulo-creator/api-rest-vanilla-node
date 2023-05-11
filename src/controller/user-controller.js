let users = require('../mocks/users.js');

module.exports = {
  listUsers(request, response) {
    const { order } = request.query

    const sortedUsers = users.sort((a, b) => {
      if(order === 'desc') {
        return a.id < b.id ? 1 : -1
      }
      return a.id > b.id ? 1 : -1
    })

    response.send(200, sortedUsers)
  },

  getUserById(request, response) {
    const { id } = request.params

    const user = users.find((u) => (
      u.id === parseInt(id)
    ))

    if(!user) {
      return response.send(400, { message: 'User not found' })
    }
    response.send(200, user)
  },

  createUser(request, response) {
    const { body } = request
    const lastUserId = users[users.length - 1].id
    const newUser = {
      id: lastUserId + 1,
      name: body.name,
      occupation: body.occupation
    }

    users.push(newUser)

    response.send(200, newUser)
  },

  updateUser(request, response) {
    let { id } = request.params
    const { name, occupation } = request.body

    id = Number(id)

    const userExists = users.find((u) => u.id === id)

    if(!userExists) {
      response.send(404, { error: 'User not found'})
    }

    users = users.map((user) => {
      return user.id === id ? {...user, name, occupation} : user
    })

    response.send(200, { id, name, occupation })
  },

  deleteUser(request, response) {
    let { id } = request.params

    id = Number(id)

    users = users.filter((u) => u.id !== id)
    response.send(200, { deleted: true })
  },
}
