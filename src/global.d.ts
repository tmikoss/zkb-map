interface SolarSystem {
  id: number
  name: string
  x: number
  y: number
  z: number
  radius: number
  security: number
  regionId: number
  regionName?: string
}

interface Region {
  id: number
  name: string
  x: number
  y: number
  z: number
}

interface Killmail {
  id: number
  time: Date
  receivedAt: Date
  characterId: number
  corporationId: number
  allianceId?: number
  shipTypeId: number
  solarSystemId: number
  url: string
  totalValue: number
  scaledValue: number
}
