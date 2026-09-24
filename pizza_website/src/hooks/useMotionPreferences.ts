import { createContext, useContext } from 'react'

export const MotionContext = createContext({ reduced: true })
export const useMotionPreferences = () => useContext(MotionContext)
