import React, { memo, Suspense} from 'react'
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing'
import compact from 'lodash/compact'
import { useDetectGPU } from '@react-three/drei/useDetectGPU'

const Effects: React.FC = () => {
  const { tier } = useDetectGPU()

  if (tier === "0") {
    return null
  }

  const adequateGpu = parseInt(tier) > 1

  const effects = compact([
    adequateGpu && <Bloom luminanceThreshold={0.4} luminanceSmoothing={1} intensity={2} key='bloom' />,
    adequateGpu && <Noise opacity={0.04} key='noise' />,
    <Vignette eskil={false} offset={0.1} darkness={1.1} key='vignette' />
  ])

  return <Suspense fallback={null}>
    <EffectComposer>{effects}</EffectComposer>
  </Suspense>
}

export default memo(Effects)
