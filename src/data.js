const axios = require('axios')
const fs = require('fs')

const FILES = {
  VILLAGE: 'village',
  PLAYER: 'player',
  ALLY: 'ally',
}

const VILLAGE = {
  // $village_id, $name, $x, $y, $player_id, $points, $rank
  ID: 0,
  NAME: 1,
  X: 2,
  Y: 3,
  PLAYER_ID: 4,
  POINTS: 5,
  RANK: 6,
}

const PLAYER = {
  // $player_id, $name, $tribe_id, $villages, $points, $rank
  ID: 0,
  NAME: 1,
  TRIBE_ID: 2,
  VILLAGES: 3,
  POINTS: 4,
  RANK: 5,
}

const ALLY = {
  // $tribe_id, $name, $tag, $members, $villages, $points, $all_points, $rank
  TRIBE_ID: 0,
  NAME: 1,
  TAG: 2,
  MEMBERS: 3,
  VILLAGES: 4,
  POINTS: 5,
  ALL_POINTS: 6,
  RANK: 7,
}

const cache = {}

const dirname = (path) => `${__dirname}/../data/${path}`

const updateFile = async (server, file) => {
  const response = await axios.get(`https://${server}/map/${file}.txt`)

  if (response.status === 200) {
    fs.mkdirSync(dirname(server), { recursive: true })
    fs.writeFileSync(dirname(`${server}/${file}.txt`), response.data)
    fs.writeFileSync(dirname(`${server}/${file}.date`), `${Date.now()}`)
  }
}

const getFile = async (server, file) => {
  if (!cache[server]) cache[server] = {}

  if (cache[server][file]) {
    if (Date.now() - cache[server][file].date > 1000 * 3600) {
      fs.unlinkSync(dirname(`${server}/${file}.date`))
      fs.unlinkSync(dirname(`${server}/${file}.txt`))
      delete cache[server][file]
    }
  }

  if (!cache[server][file]) {
    if (fs.existsSync(dirname(`${server}/${file}.date`))) {
      const fileDate = fs.readFileSync(dirname(`${server}/${file}.date`)).toString()
      if (Date.now() - fileDate > 1000 * 3600) {
        delete cache[server][file]
        fs.unlinkSync(dirname(`${server}/${file}.date`))
        fs.unlinkSync(dirname(`${server}/${file}.txt`))
      }
    }

    if (!fs.existsSync(dirname(`${server}/${file}.txt`))) {
      await updateFile(server, file)
    }

    cache[server][file] = {
      date: Date.now(),
      txt: decodeURI(fs.readFileSync(dirname(`${server}/${file}.txt`)).toString()).split('\n').map(line => line.split(',')),
    }
  }

  return cache[server][file].txt
}

module.exports = {
  FILES,
  VILLAGE,
  PLAYER,
  ALLY,
  getFile,
}
