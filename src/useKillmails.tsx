import { useEffect, useReducer } from 'react'
import parseISO from 'date-fns/parseISO'
import differenceInSeconds from 'date-fns/differenceInSeconds'
import uniqBy from 'lodash/uniqBy'

const SUBSCRIBE_MESSAGE = JSON.stringify({
  "action": "sub",
  "channel": "killstream"
})

const MAX_KILLMAIL_AGE_SEC = 60
const DECAY_INTERVAL_MS = 10 * 1000

type UnparsedTimestamp = string

interface WebsocketKillmail {
  killmail_id: number
  killmail_time: UnparsedTimestamp
  solar_system_id: number
  victim: {
    alliance_id?: number
    character_id: number
    corporation_id: number
    ship_type_id: number
    position: {
      x: number,
      y: number,
      z: number
    }
  }
  zkb: {
    totalValue: number
    fittedValue: number
    locationID: number
    npc: boolean
    awox: boolean
    solo: boolean
    url: string
  }
}

export interface Killmail {
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
}

type ReceiveWebsocketAction = {
  type: 'RECEIVE_WEBSOCKET'
  payload: WebsocketKillmail
}

type DecayAction = {
  type: 'DECAY'
}

type KillmailAction = ReceiveWebsocketAction | DecayAction

function reduceKillmails(state: Killmail[], action: KillmailAction): Killmail[] {
  // console.log(action)
  switch (action.type) {
    case 'RECEIVE_WEBSOCKET': {
      const { killmail_id, killmail_time, victim, solar_system_id, zkb } = action.payload

      const time = parseISO(killmail_time)

      const killmail: Killmail = {
        id: killmail_id,
        time,
        receivedAt: new Date(),
        characterId: victim.character_id,
        corporationId: victim.corporation_id,
        allianceId: victim.alliance_id,
        shipTypeId: victim.ship_type_id,
        solarSystemId: solar_system_id,
        url: zkb.url,
        totalValue: zkb.totalValue
      }

      return uniqBy([killmail, ...state], 'id')
    }
    case 'DECAY': {
      const now = new Date()
      return state.filter(killmail => differenceInSeconds(now, killmail.receivedAt) < MAX_KILLMAIL_AGE_SEC)
    }
    default:
      return state
  }
}

export function useKillmails(props: { sourceUrl: string }): Killmail[] {
  const { sourceUrl } = props
  const [killmails, dispatch] = useReducer(reduceKillmails, [])

  useEffect(() => {
    const interval = setInterval(() => dispatch({ type: 'DECAY' }), DECAY_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [dispatch])

  useEffect(() => {
    const connection = new WebSocket(sourceUrl)

    connection.onopen = () => {
      connection.send(SUBSCRIBE_MESSAGE)
    }

    connection.onmessage = (e) => {
      const killmail: WebsocketKillmail = JSON.parse(e.data)
      dispatch({ type: 'RECEIVE_WEBSOCKET', payload: killmail })
    }

    return () => connection.close()
  }, [sourceUrl, dispatch])

  return killmails
}
