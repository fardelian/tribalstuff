const express = require('express')
const fakes = require('./fakes')
const fs = require('fs')
const markdown = require('markdown-it')()

const client = {
  fakes: require('../client/fakes'),
  supportCounter: fs.readFileSync(`${__dirname}/../client/support-counter.js`),
  readme: markdown.render(fs.readFileSync(`${__dirname}/../README.md`).toString()),
}

const PORT = 8000

const app = express()

function err (res, e) {
  console.error(e)
  res.status(500)
  res.end('alert("error!")')
}

app
  .get('/fakes/random', (req, res) => {
    try {
      const server = (req.query.server || '').trim()
      const tribes = (req.query.tribes || '').toLowerCase().split(' ').map(tribe => tribe.trim()).filter(Boolean)
      const players = (req.query.players || '').toLowerCase().split(' ').map(player => player.trim()).filter(Boolean)
      const coords = (req.query.coords || '').split(' ').map(coord => coord.trim()).filter(Boolean)

      if (!server) {
        res.status(400)
        res.send(`Missing server`)
      }

      fakes.getRandomCoord(server, tribes, players, coords)
        .then(data => {
          if (!data) {
            return res.end('alert("error!")')
          }
          client.fakes(req, res, data)
        })
        .catch(e => err(res, e))
    } catch (e) {
      err(res, e)
    }
  })

  .get('/support-counter', (req, res) => {
    res.header('Content-Type', 'text/javascript')
    res.send(client.supportCounter)
  })

  .get('/', (req, res) => {
    res.header('Content-Type', 'text/html')
    res.send(`<style>body{font-family:-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"}</style>\n${client.readme}`)
  })

  .use('/static', express.static(`${__dirname}/../static`))

app.listen(PORT, () => console.log(`App is listening on :${PORT} with PID ${process.pid}`))
