const express = require('express')
const fakes = require('./fakes')

const PORT = 8000

const app = express()

function err (res, e) {
  console.error(e)
  res.status(500)
  res.end('alert("error!")')
}

app.get('/fakes/random', function (req, res) {
  try {
    const server = (req.query.server || '').trim()
    const tribes = req.query.tribes || ''
    const players = req.query.players || ''
    const coords = req.query.coords || ''

    if (!server) {
      res.status(400)
      res.send(`Missing server`)
    }

    const fixedTribes = tribes.toLowerCase().split(' ').map(tribe => tribe.trim()).filter(Boolean)
    const fixedPlayers = players.toLowerCase().split(' ').map(player => player.trim()).filter(Boolean)
    const fixedCoords = coords.toLowerCase().split(' ').map(coord => coord.trim()).filter(Boolean)

    fakes.getRandomCoord(server, fixedTribes, fixedPlayers, fixedCoords)
      .then(data => {
        if (!data) {
          return res.end('alert("error!")')
        }
        const [x, y] = data.split('|')
        res.send(`
if ($('#units_entry_all_spy').text().replace(/[^\\d]/g,'')>0) $('#unit_input_spy').val(1);
if ($('#units_entry_all_catapult').text().replace(/[^\\d]/g,'')>0) $('#unit_input_catapult').val(1); else
if ($('#units_entry_all_ram').text().replace(/[^\\d]/g,'')>0) $('#unit_input_ram').val(1);
$('#inputx').val('${x}'); $('#inputy').val('${y}'); $('#place_target').val('${data}'); $('#target_attack').focus();
`)
      })
      .catch(e => err(res, e))
  } catch (e) {
    err(res, e)
  }
})

app.listen(PORT, () => console.log(`App is listening on :${PORT}`))
