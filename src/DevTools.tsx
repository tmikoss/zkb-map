import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { useAppDispatch, receiveKillmail, useAppSelector } from './store'
import { theme } from './utils/theme'
import { Stats } from 'drei'
import random from 'lodash/random'
import sample from 'lodash/sample'
import { scaleValue } from './utils/scaling'

const Container = styled.div`
  position: absolute;
  top: 1vh;
  right: 1vw;
  color: ${theme.text};
  display: flex;
  flex-flow: column;
  gap: 1vh;
`

const minValue = 10_000
const maxValue = 10_000_000_000

let testId = new Date().getTime()
const buildTestKillmail = (value: number, solarSystemId: string): Killmail => {
  testId += 1

  const now = new Date()

  return {
    id: testId,
    time: now,
    receivedAt: now,
    characterId: 90230071,
    corporationId: 98076155,
    allianceId: 99007254,
    shipTypeId: 22456,
    solarSystemId: parseInt(solarSystemId),
    url: 'https://example.com',
    totalValue: value,
    scaledValue: scaleValue(value)
  }
}

const DevTools: React.FC<{}> = () => {
  const solarSystems = useAppSelector(state => state.solarSystems)
  const dispatch = useAppDispatch()
  const [activityInterval, setAcitivtyInterval] = useState(1000)

  const randomSolarSystemId = useCallback(() => sample(Object.keys(solarSystems)) as string, [solarSystems])

  const [statsOn, setStatsOn] = useState(false)

  const [activityOn, setActivityOn] = useState(false)
  useEffect(() => {
    let timeout: number

    if (activityOn) {
      const randomInterval = () => random(activityInterval * 0.8, activityInterval * 1.2)
      const activity = () => {
        const bigKillChance = random(100)
        const maxAllowed = bigKillChance > 90 ? maxValue : minValue * 1000
        const id = randomSolarSystemId()
        const value = random(minValue, maxAllowed)
        dispatch(receiveKillmail(buildTestKillmail(value, id)))
        timeout = setTimeout(activity, randomInterval())
      }

      timeout = setTimeout(activity, randomInterval())

      return () => clearTimeout(timeout)
    }
  }, [activityOn, dispatch, randomSolarSystemId, activityInterval])

  const [oneSystemFightOn, setOneSystemFightOn] = useState(false)
  useEffect(() => {
    let timeout: number

    if (oneSystemFightOn) {
      const id = randomSolarSystemId()
      const randomInterval = () => random(activityInterval * 0.8, activityInterval * 1.2)
      const activity = () => {
        const bigKillChance = random(100)
        const maxAllowed = bigKillChance > 70 ? maxValue : minValue * 1000
        const value = random(minValue, maxAllowed)
        dispatch(receiveKillmail(buildTestKillmail(value, id)))
        timeout = setTimeout(activity, randomInterval())
      }

      timeout = setTimeout(activity, randomInterval())

      return () => clearTimeout(timeout)
    }
  }, [oneSystemFightOn, dispatch, randomSolarSystemId, activityInterval])

  return <Container>
    <label>
      <input type='checkbox' checked={statsOn} onChange={() => setStatsOn(!statsOn)} />
      Show FPS
    </label>
    {statsOn && <Stats />}

    <label>
      <input type='range' min={500} max={30000} value={activityInterval} onChange={({ target: { value } }) => setAcitivtyInterval(parseInt(value)) }/>
      <div>
        Activity interval: {activityInterval}
      </div>
    </label>

    <label>
      <input type='checkbox' checked={activityOn} onChange={() => setActivityOn(!activityOn)} />
      Constant random activity
    </label>

    <label>
      <input type='checkbox' checked={oneSystemFightOn} onChange={() => setOneSystemFightOn(!oneSystemFightOn)} />
      One system activity
    </label>

    <button onClick={() => dispatch(receiveKillmail(buildTestKillmail(random(maxValue / 10, maxValue), randomSolarSystemId())))}>
      Big boom
    </button>
  </Container>
}

export default DevTools
