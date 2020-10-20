import React, { memo, Suspense} from 'react'
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing'
import { useThree } from 'react-three-fiber'
import compact from 'lodash/compact'

const Effects: React.FC = () => {
  const { gl } = useThree()
  const { isWebGL2 } = gl.capabilities

  const effects = compact([
    isWebGL2 && <Bloom luminanceThreshold={0.4} luminanceSmoothing={1} intensity={2} key='bloom' />,
    isWebGL2 && <Noise opacity={0.04} key='noise' />,
    <Vignette eskil={false} offset={0.1} darkness={1.1} key='vignette' />
  ])

  return <Suspense fallback={null}>
    <EffectComposer>{effects}</EffectComposer>
  </Suspense>
}

export default memo(Effects)
