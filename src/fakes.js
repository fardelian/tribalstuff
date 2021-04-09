const crypto = require('crypto')
const data = require('./data')

const cache = {}

const getAllCoords = async (server, tribeNames, playerNames, coords) => {
  const cacheKey = crypto.createHash('sha1').update(JSON.stringify([server, tribeNames, playerNames, coords])).digest('base64')
  if (cache[cacheKey] && (Date.now() - cache[cacheKey].date < 1000 * 3600)) {
    return cache[cacheKey].coords
  }

  const [dataAlly, dataPlayer, dataVillage] = await Promise.all([
    data.getFile(server, data.FILES.ALLY),
    data.getFile(server, data.FILES.PLAYER),
    data.getFile(server, data.FILES.VILLAGE),
  ])

  const allyIds = dataAlly
    .filter(ally => tribeNames.includes(ally[data.ALLY.TAG]))
    .map(ally => ally[data.ALLY.TRIBE_ID])

  const playerIds = dataPlayer
    .filter(player => allyIds.includes(player[data.PLAYER.TRIBE_ID]) || playerNames.includes(player[data.PLAYER.NAME]))
    .map(player => player[data.PLAYER.ID])

  const targetCoords = [
    ...coords,
    ...dataVillage
      .filter(village => playerIds.includes(village[data.VILLAGE.PLAYER_ID]))
      .map(village => `${village[data.VILLAGE.X]}|${village[data.VILLAGE.Y]}`),
  ]

  cache[cacheKey] = {
    date: Date.now(),
    coords: targetCoords,
  }

  return targetCoords
}

const getRandomCoord = async (server, tribes, players, coords) => {
  const allCoords = await getAllCoords(server, tribes, players, coords)
  return allCoords[Math.floor(Math.random() * allCoords.length)]
}

module.exports = { getRandomCoord }
