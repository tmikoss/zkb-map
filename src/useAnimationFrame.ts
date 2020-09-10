import { useEffect } from 'react'

export function useAnimationFrame(callback: () => void): void {
  useEffect(() => {
    let requestRef: number
    const requestInLoop = () => {
      callback()
      requestRef = requestAnimationFrame(requestInLoop)
    }
    requestRef = requestAnimationFrame(requestInLoop)
    return () => cancelAnimationFrame(requestRef)
  }, [callback])
}
