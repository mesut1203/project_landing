import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/barlow-condensed/latin-500.css'
import '@fontsource/manrope/latin-400.css'
import '@fontsource/manrope/latin-500.css'
import '@fontsource/manrope/latin-600.css'
import './index.css'
import './redesign.css'
import App from './App'
import { brand } from './data/content'

document.title = brand.title
document.querySelector('meta[name="description"]')?.setAttribute('content', brand.description)
for (const [name, color] of Object.entries(brand.colors)) document.documentElement.style.setProperty(`--${name}`, color)

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
