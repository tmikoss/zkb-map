import { useEffect } from 'react'
import parseISO from 'date-fns/parseISO'
import { scaleValue, MAX_KILLMAIL_AGE_SEC } from './utils/scaling'
import { useAppDispatch, receiveKillmail, trimKillmailsBefore, receivePing, AppDispatch } from './store'
import each from 'lodash/each'

const subscribeMessage = (channel: string) => JSON.stringify({
  "action": "sub",
  "channel": channel
})

const decayIntervalMs = 10 * 1000

type WebsocketStatusMessage = {
  action: 'tqStatus'
  tqStatus: string
  tqCount: string
  kills: string
}

type WebsocketKillmail = {
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

type WebsocketMessage = WebsocketKillmail | WebsocketStatusMessage

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

const processWebsocketMessage = (message: WebsocketMessage, dispatch: AppDispatch) => {
  if ('killmail_id' in message) {
    dispatch(receiveKillmail(parseWebsocketKillmail(message)))
  } else if ('tqStatus' in message) {
    dispatch(receivePing())
  }
}

export function useKillmails(sourceUrl: string): void {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(trimKillmailsBefore(MAX_KILLMAIL_AGE_SEC))
    }, decayIntervalMs)
    return () => clearInterval(interval)
  }, [dispatch])

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + '/api/recent').then(res => res.json()).then(data => {
      each(data, message => processWebsocketMessage(message, dispatch))
    })
  }, [dispatch])

  useEffect(() => {
    const connection = new WebSocket(sourceUrl)

    connection.onopen = () => {
      connection.send(subscribeMessage('killstream'))
      connection.send(subscribeMessage('public'))
    }

    connection.onmessage = (e) => {
      processWebsocketMessage(JSON.parse(e.data), dispatch)
    }

    connection.onclose = (e) => {
      console.error(e)
    }

    return () => connection.close()
  }, [sourceUrl, dispatch])
}
