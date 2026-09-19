import { createContext, useContext } from 'react'

export const MotionContext = createContext({ cinematic: false, reduced: false, paused: false, toggle: () => {} })
export const useMotionPreferences = () => useContext(MotionContext)
