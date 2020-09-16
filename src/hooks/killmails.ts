import differenceInMilliseconds from 'date-fns/differenceInMilliseconds'
import { useCallback, useEffect } from 'react'
import pickBy from 'lodash/pickBy'
import create from 'zustand'
import parseISO from 'date-fns/parseISO'
import { scaleValue } from '../utils/scaling'
import { useConnection } from './connection'

export const normalKillmailAgeMs = 45 * 1000
const trimIntervalMs = 5 * 1000

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

type State = {
  killmails: Record<string, Killmail>,
  focused?: Killmail,
  receiveKillmail: (killmail: Killmail) => void,
  trimKillmails: () => void,
  focus: (id: Killmail['id']) => void,
  unfocus: (id: Killmail['id']) => void
}

const shouldKeep = (now: Date, killmail: Killmail) => {
  const { scaledValue, receivedAt } = killmail
  const age = differenceInMilliseconds(now, receivedAt)
  return age < normalKillmailAgeMs * scaledValue
}

const subscribeMessage = (channel: string) => JSON.stringify({
  "action": "sub",
  "channel": channel
})

const parseKillmail = (raw: WebsocketKillmail): Killmail => {
  const { killmail_id, killmail_time, victim, solar_system_id, zkb } = raw
  const { character_id, corporation_id, alliance_id, ship_type_id } = victim
  const { url, totalValue } = zkb
  const time = parseISO(killmail_time)

  return {
    id: killmail_id,
    time,
    receivedAt: new Date(),
    characterId: character_id,
    corporationId: corporation_id,
    allianceId: alliance_id,
    shipTypeId: ship_type_id,
    solarSystemId: solar_system_id,
    url,
    totalValue,
    scaledValue: scaleValue(totalValue)
  }
}

export const useKillmails = create<State>(set => ({
  killmails: {},
  focused: undefined,
  receiveKillmail: (killmail) => { set(state => ({ killmails: { ...state.killmails, [killmail.id]: killmail } })) },
  trimKillmails: () => {
    const shouldKeepNow = shouldKeep.bind(undefined, new Date())
    set(state => {
      const killmails = pickBy(state.killmails, shouldKeepNow)
      const changes: Partial<State> = { killmails }
      if (state.focused && !killmails[state.focused.id]) {
        changes.focused = undefined
      }
      return changes
    })
  },
  focus: (id) => { set(state => ({ focused: state.killmails[id] })) },
  unfocus: (id) => { set(state => state.focused && state.focused.id === id ? { focused: undefined } : {}) }
}))

export const useKillmailMonitor = (sourceUrl: string): void => {
  const receivePing = useConnection(useCallback(state => state.receivePing, []))
  const trimKillmails = useKillmails(useCallback(state => state.trimKillmails, []))
  const receiveKillmail = useKillmails(useCallback(state => state.receiveKillmail, []))

  useEffect(() => {
    const interval = setInterval(trimKillmails, trimIntervalMs)
    return () => clearInterval(interval)
  }, [trimKillmails])

  useEffect(() => {
    const connection = new WebSocket(sourceUrl)

    connection.onopen = () => {
      connection.send(subscribeMessage('killstream'))
      connection.send(subscribeMessage('public'))
    }

    connection.onmessage = (e) => {
      const parsed: WebsocketMessage = JSON.parse(e.data)

      if ('killmail_id' in parsed) {
        receiveKillmail(parseKillmail(parsed))
      } else if ('tqStatus' in parsed) {
        receivePing()
      } else {
        console.error(parsed)
      }
    }

    connection.onclose = (e) => {
      console.error(e)
    }

    return () => connection.close()
  }, [sourceUrl, receiveKillmail, receivePing])
}
