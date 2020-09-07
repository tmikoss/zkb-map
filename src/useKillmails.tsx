import { useEffect } from 'react'
import parseISO from 'date-fns/parseISO'
import subSeconds from 'date-fns/subSeconds'
import { scaleValue, MAX_KILLMAIL_AGE_SEC } from './utils/scaling'
import { useAppDispatch, receiveKillmail, trimKillmailsBefore } from './store'

const subscribeMessage = JSON.stringify({
  "action": "sub",
  "channel": "killstream"
})

const decayIntervalMs = 10 * 1000

interface WebsocketKillmail {
  killmail_id: number
  killmail_time: string
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

const parseWebsocketKillmail = (raw: WebsocketKillmail): Killmail => {
  const { killmail_id, killmail_time, victim, solar_system_id, zkb } = raw

  const time = parseISO(killmail_time)

  return {
    id: killmail_id,
    time,
    receivedAt: new Date(),
    characterId: victim.character_id,
    corporationId: victim.corporation_id,
    allianceId: victim.alliance_id,
    shipTypeId: victim.ship_type_id,
    solarSystemId: solar_system_id,
    url: zkb.url,
    totalValue: zkb.totalValue,
    scaledValue: scaleValue(zkb.totalValue)
  }
}

export function useKillmails(sourceUrl: string): void {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(trimKillmailsBefore(subSeconds(new Date(), MAX_KILLMAIL_AGE_SEC)))
    }, decayIntervalMs)
    return () => clearInterval(interval)
  }, [dispatch])

  useEffect(() => {
    const connection = new WebSocket(sourceUrl)

    connection.onopen = () => {
      connection.send(subscribeMessage)
    }

    connection.onmessage = (e) => {
      dispatch(
        receiveKillmail(
          parseWebsocketKillmail(JSON.parse(e.data))
        )
      )
    }

    return () => connection.close()
  }, [sourceUrl, dispatch])
}
