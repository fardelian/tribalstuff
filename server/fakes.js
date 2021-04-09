const getCoords = require('./coords')

const getRandomCoord = async (server, tribes, players, coords) => {
  const allCoords = await getCoords(server, tribes, players, coords)
  return allCoords[Math.floor(Math.random() * allCoords.length)]
}

module.exports = { getRandomCoord }
