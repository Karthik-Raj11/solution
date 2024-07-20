const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
const dbpath = path.join(__dirname, 'cricketTeam.db')
const app = express()
app.use(express.json())
let db = null
const crud = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('server is running properly at port 3000')
    })
  } catch (err) {
    console.log(err.message)
  }
}
crud()
function convertobject(item) {
  return {
    playerId: item.player_id,
    playerName: item.player_name,
    jerseyNumber: item.jersey_number,
    role: item.role,
  }
}
// API 1 "Returns a list of all players in the team"
app.get('/players/', async (request, response) => {
  const query = `SELECT * FROM cricket_team`
  const get_query = await db.all(query)
  response.send(get_query.map(eachItem => convertobject(eachItem)))
})

// API 2 "Creates a new player in the team"
app.post('/players/', async (request, response) => {
  const {playerName, jerseyNumber, role} = request.body
  const query = `INSERT INTO cricket_team
                (player_name, jersey_number, role)
                VALUES ("${playerName}", ${jerseyNumber}, "${role}")`
  const res = await db.run(query)
  // const create_q = res.map(eachItem => convertobject(eachItem))
  // const lastId = res.lastId
  response.send(`Player Added to Team`)
})

// API 3 "Returns a player based on a player ID"
app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const query = `SELECT * FROM cricket_team WHERE player_id = ${playerId}`
  const res_q = await db.get(query)
  response.send(res_q)
})

// API 4 "Updates the details of a player in the team"
app.put('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const {playerName, jerseyNumber, role} = request.body
  const query = `UPDATE cricket_team 
                  SET player_name = "${playerName}",
                  jersey_number = ${jerseyNumber},
                  role = "${role}"
                  WHERE player_id = ${playerId}`
  const update_query = await db.run(query)
  const lastId = update_query.lastId
  response.send(`Player Details Updated`)
})

// API 5 "Deletes a player from the team"
app.delete('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const query = `DELETE FROM cricket_Team WHERE player_id = ${playerId}`
  await db.run(query)
  response.send('Player Removed')
})

module.exports = app
