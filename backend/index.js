require('dotenv').config()

const path = require('path')
const express = require('express')
const ws = require('ws')
const redis = require('redis')

const redisClient = redis.createClient({ url: process.env.REDIS_URL })

const persistSec = 60 * 5

const zkbConnection = new ws(process.env.SOURCE_URL)
zkbConnection.onopen = () => {
  zkbConnection.send(JSON.stringify({ 'action': 'sub', 'channel': 'killstream' }))
}

zkbConnection.onmessage = (e) => {
  try {
    const parsed = JSON.parse(e.data)
    const id = parsed['killmail_id']
    redisClient.setex(id, persistSec, e.data)
  } catch (error) {
    console.error(error)
  }
}

zkbConnection.onclose = (error) => {
  console.error(error)
  setTimeout(() => process.exit(1), 10)
}

const app = express()

app.use('/', express.static(path.join(__dirname, 'public')))

app.get('/api/recent', (_req, res) => {
  res.setHeader('Content-Type', 'application/json')
  redisClient.keys('*', (_err, keys) => {
    res.write('[')

    Promise.all(keys.map(key => {
      return new Promise(resolve => {
        redisClient.get(key, (_err, value) => {
          if (value) {
            res.write(value)
            res.write(',')
          }
          resolve()
        })
      })
    })).then(() => {
      res.end('{}]')
    })
  })
})

app.listen(process.env.PORT)
