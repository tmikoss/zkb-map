import { useEffect } from 'react'
import { useAppDispatch, checkConnection } from './store'

const checkInterval = 5 * 1000

export function useConnectionStatus(): void {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(checkConnection())
    }, checkInterval)
    return () => clearInterval(interval)
  }, [dispatch])
}
