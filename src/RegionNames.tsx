import React, { useContext, memo, useCallback } from 'react'
import * as THREE from 'three'
import { ThemeContext } from 'styled-components'
import { useConfiguration, useSolarSystems } from './hooks'
import pickBy from 'lodash/pickBy'
import { Text } from 'drei'

const RegionNames: React.FC<{
  solarSystems: Record<string, SolarSystem>
}> = ({ solarSystems }) => {
  const theme = useContext(ThemeContext)
  const enabled = useConfiguration(useCallback(state => state.showRegionNames, []))

  const regions = useSolarSystems(useCallback(state => {
    const regionIds = new Set()
    for (const solarSystem of Object.values(solarSystems)) {
      regionIds.add(solarSystem.regionId)
    }

    return Object.values(pickBy(state.regions, region => regionIds.has(region.id)))
  }, [solarSystems]))

  if (!enabled) {
    return null
  }

  const texts = regions.map(region => {
    const { id, x, y, z, name } = region

    const position = new THREE.Vector3(x, y, z)

    return <Text
      anchorX='center'
      anchorY='middle'
      position={position}
      color={theme.text}
      fontSize={theme.regionFontSize}
      key={id}
    >
      {name}
    </Text>
  })

  return <>{texts}</>
}

export default memo(RegionNames)
