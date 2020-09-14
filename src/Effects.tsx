import React, { memo} from 'react'
import { EffectComposer, Bloom, Noise, Vignette } from 'react-postprocessing'
import { useThree } from 'react-three-fiber'

const Effects: React.FC = () => {
  const { gl } = useThree()
  // Multisampling kills WebGL renderer on low power devices. This seems to be reasonable way of detection.
  const multisampling = gl.capabilities.maxTextureSize > 8192 ? 8 : 0

  return <EffectComposer multisampling={multisampling}>
    <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={3} />
    <Noise opacity={0.04} />
    <Vignette eskil={false} offset={0.1} darkness={1.1} />
  </EffectComposer>
}

export default memo(Effects)
