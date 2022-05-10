import { useState } from 'react'
import { SimpleStore } from './SimpleStore'

export const useStoredState = <T>(
  key: string,
  initialValue: T
): [T, (newVal: T) => void] => {
  const [value, setValue] = useState<T>(initialValue)
  const setStore = (newVal: T) => {
    SimpleStore.set(key, newVal)
    setValue(newVal)
  }
  return [value, setStore]
}
