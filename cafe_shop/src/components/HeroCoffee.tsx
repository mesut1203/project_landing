import TiltedCard from './react-bits/TiltedCard'
import { useReducedMotionPreference, useFinePointer } from '../hooks/useMotionPreference'

export function HeroCoffee() {
  const reduced = useReducedMotionPreference()
  const finePointer = useFinePointer()
  const image = '/images/editorial/ritual.webp'
  const alt = 'Tách cà phê sứ bên phin Việt trên bàn gỗ, trong nắng sớm của quán'
  return (
    <div className="hero-scene" id="hero-scene">
      {reduced || !finePointer ? (
        <figure className="tilted-card-figure"><div className="tilted-card-inner"><img className="tilted-card-img" src={image} alt={alt} width="1536" height="1024" fetchPriority="high" /></div></figure>
      ) : (
        <TiltedCard imageSrc={image} altText={alt} containerHeight="" containerWidth="100%" imageHeight="100%" imageWidth="100%" scaleOnHover={1.025} rotateAmplitude={3} showMobileWarning={false} showTooltip={false} />
      )}
      <div className="hero-photo-caption"><span>Một tách, thật chậm.</span><span>ROBUSTA / SỮA / NẮNG SỚM</span></div>
    </div>
  )
}
