const yaml = require('js-yaml')
const glob = require('glob')
const fs = require('fs')

const COORDINATE_SCALE_FACTOR = 1_000_000_000_000_000

const nameFile = fs.readFileSync('./sde/bsd/invNames.yaml', 'utf8')
const nameJson = yaml.safeLoad(nameFile)

let names = nameJson.reduce((lookup, item) => {
  const { itemID, itemName } = item
  lookup[itemID] = itemName
  return lookup
}, {})

const normalize = (n) => Math.round(n / COORDINATE_SCALE_FACTOR)

glob('./sde/fsd/universe/eve/**/solarsystem.staticdata', (err, files) => {
  if (err) {
    console.error(err)
  }

  let systems = {}

  for (const fileName of files) {
    const systemFile = fs.readFileSync(fileName, 'utf8')
    const systemJson = yaml.safeLoad(systemFile)

    const { center: [x, y, z], radius, security, solarSystemID } = systemJson

    systems[solarSystemID] = {
      x: normalize(x),
      y: normalize(y),
      z: normalize(z),
      r: normalize(radius),
      s: Math.round(security * 10) / 10,
      n: names[solarSystemID]
    }
  }

  fs.writeFileSync('./public/data/solarSystems.json', JSON.stringify(systems))
})

