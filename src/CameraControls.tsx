import React, {  useRef } from 'react'
import { useFrame, extend, useThree } from 'react-three-fiber'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

extend({ OrbitControls })

declare global {
  namespace JSX {
    interface IntrinsicElements {
      orbitControls: React.DetailedHTMLProps<any, any>
    }
  }
}

export const CameraControls: React.FC<{}> = () => {
  const { camera, gl: { domElement } } = useThree()
  const controls = useRef<OrbitControls>()
  useFrame(_state => controls.current?.update())
  return <orbitControls ref={controls} args={[camera, domElement]} />;
};
