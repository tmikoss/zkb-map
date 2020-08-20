import React, { useState, useMemo, useRef, useEffect } from 'react'
import { Canvas, useFrame, extend, useThree } from 'react-three-fiber'
import { SolarSystem } from './useSolarSytems'
import * as THREE from 'three'
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
