import React from 'react'
import { EffectComposer, Bloom, Noise, Vignette } from 'react-postprocessing'

const doesNotWorkOnAndroidBrowsersAndShouldBeFeatureDetected = 0

const Effects: React.FC = () => {
  return <EffectComposer multisampling={doesNotWorkOnAndroidBrowsersAndShouldBeFeatureDetected}>
    <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={3} />
    <Noise opacity={0.04} />
    <Vignette eskil={false} offset={0.1} darkness={1.1} />
  </EffectComposer>
}

export default Effects
