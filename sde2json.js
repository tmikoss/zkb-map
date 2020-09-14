const yaml = require('js-yaml')
const glob = require('glob')
const fs = require('fs')
const path = require('path')

const COORDINATE_PRECISION_FACTOR = 1_000_000
const COORDINATE_SCALE_FACTOR = 1_000_000_000_000_000 / COORDINATE_PRECISION_FACTOR

const nameFile = fs.readFileSync('./sde/bsd/invNames.yaml', 'utf8')
const nameJson = yaml.safeLoad(nameFile)

let names = nameJson.reduce((lookup, item) => {
  const { itemID, itemName } = item
  lookup[itemID] = itemName
  return lookup
}, {})

const normalize = (n) => Math.round(n / COORDINATE_SCALE_FACTOR) / COORDINATE_PRECISION_FACTOR

let systems = {}
let regions = {}

const regionFileNames = glob.sync('./sde/fsd/universe/eve/*/region.staticdata')

for (const regionFileName of regionFileNames) {
  const regionFile = fs.readFileSync(regionFileName, 'utf8')
  const regionJson = yaml.safeLoad(regionFile)

  const { center: [x, y, z], regionID } = regionJson

  regions[regionID] = {
    x: normalize(x),
    y: normalize(y),
    z: normalize(z),
    n: names[regionID]
  }

  const systemFileNames = glob.sync(`${path.dirname(regionFileName)}/**/solarsystem.staticdata`)

  for (const systemFileName of systemFileNames) {
    const systemFile = fs.readFileSync(systemFileName, 'utf8')
    const systemJson = yaml.safeLoad(systemFile)

    const { center: [x, y, z], radius, security, solarSystemID } = systemJson

    systems[solarSystemID] = {
      x: normalize(x),
      y: normalize(y),
      z: normalize(z),
      r: normalize(radius),
      s: Math.round(security * 10) / 10,
      n: names[solarSystemID],
      p: regionID
    }
  }
}

fs.writeFileSync('./public/data/universe.json', JSON.stringify({ regions, systems }))
