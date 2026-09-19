import { Hero } from './components/Hero'
import { Reveal } from './components/Reveal'
import { restaurant, menu } from './content'
import { Header } from './components/Header'
import { Icon } from './components/Icon'
import { Photo } from './components/Photo'
import { MotionPreferences } from './components/MotionPreferences'

function App() {
  return (
    <MotionPreferences>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <main id="main" tabIndex={-1}>
        <Hero />
        <div className="house-strip container" aria-label="Our approach"><span>Slow-fermented dough</span><span>Stretched by hand</span><span>Finished by fire</span></div>
        <section id="story" className="craft container section-space" aria-labelledby="craft-heading">
          <Reveal className="craft-image-wrap">
            <figure className="craft-photo">
              <Photo name="candlelit-table" alt="Candlelit wooden tables and warm amber light in a cozy dining room" width={900} height={600} sizes="(max-width: 767px) 85vw, 38vw" />
              <figcaption><span>A place to settle in.</span><span>Stay a little longer.</span></figcaption>
            </figure>
          </Reveal>
          <div className="craft-copy">
            <Reveal>
              <p className="eyebrow"><span className="section-number">01 /</span> A little patience. A lot of fire.</p>
              <h2 id="craft-heading">Dough with a<br />point of view<span className="accent-period">.</span></h2>
            </Reveal>
            <Reveal delay={0.1} className="craft-description">
              <p>Good dough takes its time. Ours ferments slowly, gets stretched by hand, and meets the fierce heat of a wood-fired oven.</p>
              <p>The result? An airy crust, a little char, and a soft middle. Finished with fresh ingredients that know when to let the dough do the talking.</p>
              <a className="text-link" href="#menu">Find your favorite <Icon name="arrow" /></a>
            </Reveal>
          </div>
        </section>
        <section className="food-section container" aria-label="From the kitchen">
          <div className="food-heading"><span>Fresh from the fire.</span><span>Best shared.</span></div>
          <div className="food-grid">
            <Reveal className="food-feature">
              <figure>
                <div className="photo-frame"><Photo name="basil-tomato" alt="Margherita pizza with fresh basil, tomato sauce, melted mozzarella and a charred crust" width={1400} height={1750} sizes="(max-width: 767px) 90vw, 50vw" /></div>
                <figcaption><span>Tomato. Basil. Nothing to hide.</span><span>01</span></figcaption>
              </figure>
            </Reveal>
            <Reveal className="food-oven" delay={0.12}>
              <figure>
                <div className="photo-frame"><Photo name="wood-fired-oven" alt="Fresh pizza cooking beside bright flames in a traditional wood-fired oven" width={1200} height={1800} sizes="(max-width: 767px) 90vw, 42vw" /></div>
                <figcaption><span>A little char makes all the difference.</span><span>02</span></figcaption>
              </figure>
              <p className="food-note">Made by hand.<br />Finished by fire.</p>
            </Reveal>
          </div>
        </section>
        <section id="menu" className="menu-section section-space" aria-labelledby="menu-heading">
          <div className="menu-layout container">
          <Reveal className="menu-intro">
            <p className="eyebrow"><span className="section-number">02 /</span> The house favorites</p>
            <h2 id="menu-heading">Tonight,<br /> eat well<span className="accent-period">.</span></h2>
            <p>For the middle of the table.<br />Or all to yourself. We get it.</p>
            <a className="text-link" href="#visit">Make an evening of it <Icon name="arrow" /></a>
          </Reveal>
          <div className="menu-content">
            <ul className="menu-list">
              {menu.map((pizza, index) => (
                <li key={pizza.name}>
                  <Reveal className="menu-row" delay={index * 0.06}>
                    <span className="menu-number" aria-hidden="true">0{index + 1}</span>
                    <div className="menu-item-copy"><h3>{pizza.name}</h3><p>{pizza.ingredients}</p></div>
                    <span className="menu-price" aria-label={`${pizza.price} dollars`}>${pizza.price}</span>
                  </Reveal>
                </li>
              ))}
            </ul>
            <p className="menu-footnote">Good food is for everyone. Let us know about allergies before you order.</p>
          </div>
          </div>
        </section>
        <section id="visit" className="visit-section" aria-labelledby="visit-heading">
          <img className="visit-background" src="/media/sequence/frame-050.jpg" alt="" width="1280" height="720" loading="lazy" decoding="async" />
          <div className="visit-shade" />
          <div className="visit-layout container">
            <Reveal className="visit-copy">
              <p className="eyebrow"><span className="section-number">03 /</span> There’s room for one more</p>
              <h2 id="visit-heading">Pull up<br />a chair<span className="accent-period">.</span></h2>
              <p>Bring your people. Order another pizza.<br />Let the evening take its time.</p>
              <a className="button" href={restaurant.bookingUrl}>Book a table <Icon name="arrow" className="button-arrow" /></a>
            </Reveal>
            <Reveal className="visit-details" delay={0.12}>
              <h3>Come hungry. Stay a while.</h3>
              <dl className="hours">
                {restaurant.hours.map(({ days, time }) => <div key={days}><dt>{days}</dt><dd>{time}</dd></div>)}
              </dl>
              <a className="contact-link" href={restaurant.bookingUrl}>{restaurant.email} <Icon name="arrow" /></a>
              {restaurant.isPreview && <p className="preview-note">Sample opening hours and email.<br />Please confirm before making a reservation.</p>}
            </Reveal>
          </div>
        </section>
      </main>
      <footer className="site-footer container">
        <div className="footer-top"><p>Wood-fired pizza.<br />Well-spent evenings.</p><a className="text-link" href="#home">Back to top <Icon name="down" className="back-arrow" /></a></div>
        <a className="wordmark footer-wordmark" href="#home" aria-label="Fiamma Pizza House, back to top">fiamma.</a>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} Fiamma Pizza House</span><span>A good night starts here.</span><a href="/style-tile.html">Style tile <span aria-hidden="true">↗</span></a></div>
      </footer>
    </MotionPreferences>
  )
}
export default App
