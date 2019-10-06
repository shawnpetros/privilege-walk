const guids = new Set()
const users = {}

const getIdentity = ({ From: f }) => {
  if (!guids.has(f)) {
    guids.add(f)
    users[f] = {
      id: f,
      score: 0
    }
  }

  return users[f]
}

const getUsers = () => Object.keys(users).map(key => users[key])

const addScore = (user, msg) => {
  if (msg.toLowerCase()[0] === 'y') {
    user.score += 2
  }
}

module.exports = {
  getIdentity,
  addScore,
  getUsers
}
