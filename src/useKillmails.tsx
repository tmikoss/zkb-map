import { useEffect } from 'react'
import parseISO from 'date-fns/parseISO'
import { scaleValue, normalKillmailAgeMs } from './utils/scaling'
import { useAppDispatch, receiveKillmail, trimKillmails, receivePing } from './store'
import map from 'lodash/map'
import compact from 'lodash/compact'
import differenceInMilliseconds from 'date-fns/differenceInMilliseconds'
import maxDate from 'date-fns/max'
import addMilliseconds from 'date-fns/addMilliseconds'

const subscribeMessage = (channel: string) => JSON.stringify({
  "action": "sub",
  "channel": channel
})

const decayIntervalMs = 2 * 1000

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

const parseWebsocketKillmail = (raw: WebsocketKillmail): Killmail | null => {
  try {
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
  } catch (error) {
    return null
  }
}

const normalizeReceivedAtForCachedMessages = (killmails: Killmail[]): Killmail[] => {
  if (killmails.length < 1) {
    return killmails
  }

  const latestTimestamp = maxDate(map(killmails, 'time'))
  const offset = differenceInMilliseconds(new Date(), latestTimestamp)

  return map(killmails, km => ({ ...km, receivedAt: addMilliseconds(km.time, offset) }))
}

export function useKillmails(sourceUrl: string): void {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(trimKillmails(normalKillmailAgeMs))
    }, decayIntervalMs)
    return () => clearInterval(interval)
  }, [dispatch])

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + '/api/recent').then(res => res.json()).then(data => {
      const killmails = normalizeReceivedAtForCachedMessages(compact(map(data, parseWebsocketKillmail)))
      map(killmails, killmail => {
        dispatch(receiveKillmail({ killmail, normalAge: normalKillmailAgeMs }))
      })
    })
  }, [dispatch])

  useEffect(() => {
    const connection = new WebSocket(sourceUrl)

    connection.onopen = () => {
      connection.send(subscribeMessage('killstream'))
      connection.send(subscribeMessage('public'))
    }

    connection.onmessage = (e) => {
      const parsed: WebsocketMessage = JSON.parse(e.data)

      if ('killmail_id' in parsed) {
        const killmail = parseWebsocketKillmail(parsed)
        if (killmail) {
          dispatch(receiveKillmail({ killmail, normalAge: normalKillmailAgeMs }))
        }
      } else if ('tqStatus' in parsed) {
        dispatch(receivePing())
      } else {
        console.error(parsed)
      }
    }

    connection.onclose = (e) => {
      console.error(e)
    }

    return () => connection.close()
  }, [sourceUrl, dispatch])
}
