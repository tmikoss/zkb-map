import React, { memo, Suspense} from 'react'
import { EffectComposer, Bloom, Noise, Vignette, SMAA } from 'react-postprocessing'
import { useThree } from 'react-three-fiber'
import compact from 'lodash/compact'

const Effects: React.FC = () => {
  const { gl } = useThree()
  const { isWebGL2, maxTextureSize } = gl.capabilities
  const enableMultisampling = isWebGL2 && maxTextureSize > 8192

  const effects = compact([
    isWebGL2 && <Bloom luminanceThreshold={0.4} luminanceSmoothing={1} intensity={2} key='bloom' />,
    isWebGL2 && <Noise opacity={0.04} key='noise' />,
    <Vignette eskil={false} offset={0.1} darkness={1.1} key='vignette' />,
    !enableMultisampling && <SMAA key='smaa' />
  ])

  return <Suspense fallback={null}>
    <EffectComposer multisampling={enableMultisampling ? 8 : 0}>{effects}</EffectComposer>
  </Suspense>
}

export default memo(Effects)
