import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { HeroCoffee } from './components/HeroCoffee'
import { useScrollReveal } from './hooks/useScrollReveal'
import { categories, formatPrice, menuItems } from './data/menu'
import type { Category, MenuItem } from './data/menu'
import './App.css'

type IconName =
  | 'arrow'
  | 'up-right'
  | 'down'
  | 'coffee'
  | 'bean'
  | 'sun'
  | 'pin'
  | 'clock'
  | 'menu'
  | 'close'
  | 'plus'
  | 'check'
  | 'heart'
  | 'leaf'

function Icon({ name, className = '' }: { name: IconName; className?: string }) {
  const paths: Record<IconName, ReactNode> = {
    arrow: <path d="M4 12h15m-6-6 6 6-6 6" />,
    'up-right': <path d="M6 18 18 6M6 6h12v12" />,
    down: <path d="M12 4v16m-6-6 6 6 6-6" />,
    coffee: (
      <path d="M4 9h12v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5ZM16 9h2a3 3 0 1 1 0 6h-2M3 22h15M7 3v2m5-2v2" />
    ),
    bean: (
      <>
        <ellipse cx="12" cy="12" rx="7" ry="10" transform="rotate(35 12 12)" />
        <path d="M16 5c-9 0 1 14-9 14" />
      </>
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
      </>
    ),
    pin: (
      <>
        <path d="M19 10c0 5-7 12-7 12S5 15 5 10a7 7 0 1 1 14 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 6v6l4 2" />
      </>
    ),
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    plus: <path d="M12 5v14M5 12h14" />,
    check: <path d="m5 12 4 4L19 6" />,
    heart: (
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0l-1 1-1-1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
    ),
    leaf: <path d="M20 3S7 1 4 9s4 14 10 9 6-15 6-15ZM3 22 16 8" />,
  }
  return (
    <svg
      className={`icon ${className}`}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}

function Brand() {
  return (
    <a className="brand" href="#home" aria-label="Nâu Coffee — về đầu trang">
      <span className="brand-word">
        nâu<span>.</span>
      </span>
      <span className="brand-caption">COFFEE & SLOW MOMENTS</span>
    </a>
  )
}

const navLinks = [
  { href: '#cau-chuyen', label: 'Câu chuyện' },
  { href: '#thuc-don', label: 'Thực đơn' },
  { href: '#khong-gian', label: 'Không gian' },
]

const gallery = [
  {
    image: '/images/cafe-interior.webp',
    title: 'Góc quầy quen',
    description: 'Tiếng máy pha và hương cà phê mới.',
  },
  {
    image: '/images/cafe-corner.webp',
    title: 'Một chỗ ngồi cho riêng mình',
    description: 'Đủ yên để đọc thêm vài trang sách.',
  },
  {
    image: '/images/iced-coffee.webp',
    title: 'Những cuộc hẹn không vội',
    description: 'Chuyện hôm nay, kể nhau nghe nhé.',
  },
]

function App() {
  useScrollReveal()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [category, setCategory] = useState<Category>('coffee')
  const [showAll, setShowAll] = useState(false)
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null)
  const [savedItems, setSavedItems] = useState<string[]>(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem('nau-saved-menu') ?? '[]')
      return Array.isArray(saved) ? saved.filter((id): id is string => typeof id === 'string') : []
    } catch {
      return []
    }
  })
  const [notice, setNotice] = useState('')
  const dialogRef = useRef<HTMLDialogElement>(null)
  const galleryRef = useRef<HTMLDialogElement>(null)
  const menuToggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (selectedItem) dialogRef.current?.showModal()
    else dialogRef.current?.close()
  }, [selectedItem])

  useEffect(() => {
    if (galleryIndex !== null) galleryRef.current?.showModal()
    else galleryRef.current?.close()
  }, [galleryIndex])

  useEffect(() => {
    if (!selectedItem && galleryIndex === null) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [selectedItem, galleryIndex])

  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(''), 4000)
    return () => window.clearTimeout(timer)
  }, [notice])

  useEffect(() => {
    if (!mobileMenuOpen) return
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false)
        menuToggleRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onEscape)
    return () => window.removeEventListener('keydown', onEscape)
  }, [mobileMenuOpen])

  const filteredItems = menuItems.filter((item) => item.category === category)
  const visibleItems = showAll ? filteredItems : filteredItems.slice(0, 3)

  function toggleSaved(item: MenuItem) {
    const wasSaved = savedItems.includes(item.id)
    const next = wasSaved ? savedItems.filter((id) => id !== item.id) : [...savedItems, item.id]
    setSavedItems(next)
    try {
      localStorage.setItem('nau-saved-menu', JSON.stringify(next))
      setNotice(wasSaved ? `Đã bỏ lưu ${item.name}.` : `Đã lưu ${item.name} trên thiết bị này.`)
    } catch {
      setNotice('Đã cập nhật món yêu thích cho phiên này. Trình duyệt không cho phép lưu lâu dài.')
    }
  }

  function changeCategory(next: Category) {
    setCategory(next)
    setShowAll(false)
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Đến nội dung chính
      </a>
      <header className="site-header" id="home">
        <div className="header-inner container" data-reveal="0">
          <Brand />
          <nav className="desktop-nav" aria-label="Điều hướng chính">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <a className="button button-brown header-visit" href="#ghe-nau">
              Ghé Nâu <Icon name="up-right" />
            </a>
            <button
              ref={menuToggleRef}
              className="icon-button menu-toggle"
              aria-label={mobileMenuOpen ? 'Đóng điều hướng' : 'Mở điều hướng'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Icon name={mobileMenuOpen ? 'close' : 'menu'} />
            </button>
          </div>
        </div>
        <nav
          className="mobile-nav"
          id="mobile-nav"
          aria-label="Điều hướng di động"
          hidden={!mobileMenuOpen}
        >
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)}>
              {link.label}
              <Icon name="up-right" />
            </a>
          ))}
          <a href="#ghe-nau" onClick={() => setMobileMenuOpen(false)}>
            Ghé Nâu
            <Icon name="up-right" />
          </a>
        </nav>
      </header>

      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <HeroCoffee />
          <div className="hero-shade" aria-hidden="true" />
          <div className="hero-inner container">
            <div className="hero-copy">
              <p className="eyebrow" data-reveal="0">
                <span className="small-line" /> CÀ PHÊ NGON. KHOẢNH KHẮC LÀNH.
              </p>
              <h1 id="hero-title" data-reveal="80">
                Chậm một chút.
                <br />
                <em>Đậm một ngày.</em>
              </h1>
              <p className="hero-description" data-reveal="140">
                Giữa những ngày vội, Nâu dành cho bạn một góc nhỏ.
                <br className="desktop-break" /> Có cà phê thơm, có câu chuyện, có bình yên.
              </p>
              <div className="hero-actions" data-reveal="200">
                <a className="button button-cream" href="#thuc-don">
                  Khám phá thực đơn <Icon name="arrow" />
                </a>
                <a className="hero-story-link" href="#cau-chuyen">
                  Chuyện của Nâu <Icon name="up-right" />
                </a>
              </div>
              <div className="hero-signature" data-reveal="240">
                <Icon name="bean" />
                <span>Từ hạt cà phê Việt, bằng tất cả chân thành.</span>
              </div>
            </div>
            <div className="coffee-seal" aria-hidden="true" data-reveal="200">
              <span>RANG MỘC</span>
              <Icon name="bean" />
              <span>VỊ NGUYÊN BẢN</span>
            </div>
            <div className="hero-bottom" data-reveal="180">
              <span>ĐẬM ĐÀ TỪ NHỮNG ĐIỀU GIẢN DỊ</span>
              <a href="#thuc-don">
                Chậm lại, khám phá thêm <Icon name="down" />
              </a>
            </div>
          </div>
        </section>

        <div className="values-strip">
          <div className="container values-inner">
            <span data-reveal="0">
              <Icon name="bean" /> Hạt Việt, vị nguyên bản
            </span>
            <span className="strip-divider" aria-hidden="true" />
            <span data-reveal="80">
              <Icon name="coffee" /> Pha mỗi tách bằng tâm
            </span>
            <span className="strip-divider" aria-hidden="true" />
            <span data-reveal="160">
              <Icon name="sun" /> Một góc nhỏ, nhiều bình yên
            </span>
          </div>
        </div>

        <section
          className="menu-section section-space container"
          id="thuc-don"
          aria-labelledby="menu-title"
        >
          <div className="section-heading menu-heading" data-reveal="0">
            <div>
              <p className="eyebrow">THỰC ĐƠN NHÀ NÂU</p>
              <h2 id="menu-title">Hôm nay, bạn uống gì?</h2>
            </div>
            <p>
              Một chút đậm, một chút ngọt.
              <br />
              Một hương vị dành riêng cho hôm nay.
            </p>
          </div>
          <div className="menu-toolbar" data-reveal="80">
            <div className="category-controls" role="group" aria-label="Lọc thực đơn">
              {categories.map((item) => (
                <button
                  key={item.id}
                  className={`category-button${category === item.id ? ' is-active' : ''}`}
                  aria-pressed={category === item.id}
                  onClick={() => changeCategory(item.id)}
                >
                  {item.name}
                </button>
              ))}
            </div>
            <span className="menu-caption">
              Pha tươi, mỗi ngày <Icon name="leaf" />
            </span>
          </div>
          <div className="product-grid" aria-live="polite" aria-atomic="false">
            {visibleItems.map((item, index) => (
              <article className="product-card" key={item.id} data-reveal={(index % 3) * 90}>
                <button
                  className={`product-photo${item.image.includes('hero-coffee') ? ' latte-photo' : ''}`}
                  onClick={() => setSelectedItem(item)}
                  aria-label={`Xem chi tiết ${item.name}`}
                >
                  <img src={item.image} alt={item.name} width="800" height="650" loading="lazy" />
                  {item.label && <span className="product-badge">{item.label}</span>}
                  <span className="product-photo-action">
                    <Icon name="plus" />
                  </span>
                </button>
                <div className="product-meta">
                  <p className="product-english">{item.english}</p>
                  <div className="product-name-row">
                    <h3>
                      <button onClick={() => setSelectedItem(item)}>{item.name}</button>
                    </h3>
                    <span className="product-price">{formatPrice(item.price)}</span>
                  </div>
                  <p className="product-description">{item.description}</p>
                  <button
                    className={`save-product${savedItems.includes(item.id) ? ' is-saved' : ''}`}
                    onClick={() => toggleSaved(item)}
                    aria-pressed={savedItems.includes(item.id)}
                    aria-label={`${savedItems.includes(item.id) ? 'Bỏ lưu' : 'Lưu'} ${item.name}`}
                  >
                    <Icon name={savedItems.includes(item.id) ? 'check' : 'heart'} />
                    {savedItems.includes(item.id) ? 'Đã lưu món' : 'Lưu món yêu thích'}
                  </button>
                </div>
              </article>
            ))}
          </div>
          <div className="menu-bottom" data-reveal="80">
            {filteredItems.length > 3 ? (
              <button className="text-link" onClick={() => setShowAll(!showAll)}>
                {showAll ? 'Thu gọn thực đơn' : 'Xem thêm cà phê'}
                <Icon name={showAll ? 'up-right' : 'arrow'} />
              </button>
            ) : (
              <span className="menu-note">Một chút đổi vị cho ngày thêm vui.</span>
            )}
            <span className="menu-note">Hãy nói với Nâu nếu bạn muốn ít ngọt hơn nhé.</span>
          </div>
        </section>

        <section className="story-section" id="cau-chuyen" aria-labelledby="story-title">
          <div className="container story-grid">
            <div className="story-visual" data-reveal="0">
              <img
                className="story-image"
                src="/images/cafe-interior.webp"
                alt="Góc quán ấm áp với quầy gỗ, những chiếc cốc sứ và đèn giấy"
                width="1400"
                height="1885"
                loading="lazy"
              />
              <div className="story-note">
                <Icon name="coffee" />
                <span>
                  Cà phê là cái cớ.
                  <br />
                  <em>Gặp nhau mới là điều hay.</em>
                </span>
              </div>
              <span className="photo-caption">MỘT GÓC NHỎ. MỘT CÂU CHUYỆN DÀI.</span>
            </div>
            <div className="story-copy" data-reveal="140">
              <p className="eyebrow">CHUYỆN CỦA NÂU</p>
              <h2 id="story-title">
                Bắt đầu từ một
                <br />
                tách cà phê <em>tử tế.</em>
              </h2>
              <p>
                Nâu tin rằng một tách cà phê ngon không cần quá nhiều điều cầu kỳ. Chỉ cần hạt được
                chọn kỹ, rang vừa tới, và một người pha thật sự quan tâm.
              </p>
              <p>
                Chúng mình tạo nên Nâu như một khoảng nghỉ giữa phố. Nơi bạn có thể ngồi lâu hơn một
                chút, nói chuyện nhiều hơn một chút, hoặc đơn giản là chẳng cần làm gì.
              </p>
              <div className="story-principles">
                <div>
                  <Icon name="bean" />
                  <h3>Chọn hạt kỹ</h3>
                  <p>Trân trọng vị ngon từ những vùng cà phê Việt.</p>
                </div>
                <div>
                  <Icon name="heart" />
                  <h3>Pha bằng tâm</h3>
                  <p>Chăm chút từng tách, như dành cho một người bạn.</p>
                </div>
              </div>
              <a className="text-link" href="#khong-gian">
                Tìm một góc của bạn <Icon name="arrow" />
              </a>
            </div>
          </div>
        </section>

        <section
          className="space-section section-space container"
          id="khong-gian"
          aria-labelledby="space-title"
        >
          <div className="section-heading" data-reveal="0">
            <div>
              <p className="eyebrow">KHÔNG GIAN NHÀ NÂU</p>
              <h2 id="space-title">Ở đây, thời gian chậm hơn.</h2>
            </div>
            <p>
              Nắng qua ô cửa. Nhạc khẽ bên tai.
              <br />
              Và một chỗ ngồi đang đợi bạn.
            </p>
          </div>
          <div className="gallery-grid">
            {gallery.map((photo, index) => (
              <button
                className={`gallery-card gallery-card-${index}`}
                key={photo.title}
                data-reveal={index * 100}
                onClick={() => setGalleryIndex(index)}
                aria-label={`Xem ảnh ${photo.title}`}
              >
                <img
                  src={photo.image}
                  alt={photo.title}
                  width="1000"
                  height="1100"
                  loading="lazy"
                />
                <span className="gallery-overlay">
                  <span>
                    <span className="gallery-number">0{index + 1}</span>
                    <strong>{photo.title}</strong>
                  </span>
                  <span className="gallery-arrow">
                    <Icon name="up-right" />
                  </span>
                </span>
              </button>
            ))}
          </div>
          <p className="space-bottom" data-reveal="80">
            <span>Đến một mình cũng vui. Đi cùng nhau càng ấm.</span>
            <a className="text-link" href="#ghe-nau">
              Hẹn bạn ở Nâu <Icon name="arrow" />
            </a>
          </p>
        </section>

        <section className="visit-section" id="ghe-nau" aria-labelledby="visit-title">
          <div className="container visit-grid">
            <div className="visit-copy" data-reveal="0">
              <p className="eyebrow">MỘT CUỘC HẸN VỚI BÌNH YÊN</p>
              <h2 id="visit-title">
                Cà phê nhé,
                <br />
                <em>mình đợi.</em>
              </h2>
              <p>
                Mang theo câu chuyện của bạn.
                <br />
                Phần cà phê, cứ để Nâu lo.
              </p>
              <a
                className="button button-cream"
                href="https://www.google.com/maps/search/?api=1&query=12+Nguyen+Van+Thu+Da+Kao+Ho+Chi+Minh"
                target="_blank"
                rel="noreferrer"
              >
                Tìm đường đến Nâu <Icon name="up-right" />
              </a>
            </div>
            <div className="visit-info">
              <div className="visit-info-row" data-reveal="100">
                <Icon name="pin" />
                <div>
                  <p className="eyebrow">GÓC NHỎ CỦA CHÚNG MÌNH</p>
                  <p>
                    12 Nguyễn Văn Thủ, Đa Kao
                    <br />
                    Thành phố Hồ Chí Minh
                  </p>
                </div>
              </div>
              <div className="visit-info-row" data-reveal="180">
                <Icon name="clock" />
                <div>
                  <p className="eyebrow">KHI NÀO BẠN GHÉ?</p>
                  <p>
                    Thứ Hai — Chủ Nhật
                    <br />
                    <span className="opening-hours">07:00 — 22:00</span>
                  </p>
                </div>
              </div>
              <div className="visit-footnote" data-reveal="220">
                <Icon name="sun" />
                <span>Cửa luôn rộng mở. Cà phê luôn sẵn sàng.</span>
              </div>
            </div>
          </div>
          <span className="visit-watermark" aria-hidden="true">
            nâu.
          </span>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-top" data-reveal="0">
          <Brand />
          <p>Chậm một chút. Đậm một ngày.</p>
          <a className="back-top" href="#home">
            Về đầu trang <Icon name="up-right" />
          </a>
        </div>
        <div className="container footer-bottom" data-reveal="100">
          <span>© {new Date().getFullYear()} Nâu Coffee. Made with a little love.</span>
          <span>Bản thiết kế mẫu · Thông tin quán và thực đơn mang tính minh họa.</span>
        </div>
      </footer>

      <div className={`toast${notice ? ' toast-visible' : ''}`} role="status" aria-live="polite">
        {notice && (
          <>
            <Icon name="check" />
            <span>{notice}</span>
          </>
        )}
      </div>

      <dialog
        className="product-dialog"
        ref={dialogRef}
        onCancel={() => setSelectedItem(null)}
        onClose={() => setSelectedItem(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setSelectedItem(null)
        }}
        aria-labelledby="product-dialog-title"
      >
        {selectedItem && (
          <div className="product-dialog-inner">
            <button
              className="icon-button dialog-close"
              onClick={() => setSelectedItem(null)}
              aria-label="Đóng chi tiết món"
              autoFocus
            >
              <Icon name="close" />
            </button>
            <div
              className={`dialog-image${selectedItem.image.includes('hero-coffee') ? ' latte-photo' : ''}`}
            >
              <img src={selectedItem.image} alt={selectedItem.name} width="800" height="800" />
            </div>
            <div className="dialog-copy">
              <p className="eyebrow">{selectedItem.english}</p>
              <h2 id="product-dialog-title">{selectedItem.name}</h2>
              <p className="dialog-price">{formatPrice(selectedItem.price)}</p>
              <p>{selectedItem.description}</p>
              <dl>
                <div>
                  <dt>Thành phần</dt>
                  <dd>{selectedItem.ingredients}</dd>
                </div>
                <div>
                  <dt>Một chút lưu ý</dt>
                  <dd>{selectedItem.note}</dd>
                </div>
                <div>
                  <dt>Thưởng thức</dt>
                  <dd>{selectedItem.serving}</dd>
                </div>
              </dl>
              <button
                className="button button-brown"
                onClick={() => toggleSaved(selectedItem)}
                aria-pressed={savedItems.includes(selectedItem.id)}
              >
                <Icon name={savedItems.includes(selectedItem.id) ? 'check' : 'heart'} />
                {savedItems.includes(selectedItem.id)
                  ? 'Đã lưu — nhấn để bỏ lưu'
                  : 'Lưu món cho lần ghé tới'}
              </button>
              <p className="dialog-helper">Danh sách yêu thích được lưu trên thiết bị của bạn.</p>
            </div>
          </div>
        )}
      </dialog>

      <dialog
        className="gallery-dialog"
        ref={galleryRef}
        onCancel={() => setGalleryIndex(null)}
        onClose={() => setGalleryIndex(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setGalleryIndex(null)
        }}
        aria-labelledby="gallery-dialog-title"
      >
        {galleryIndex !== null && (
          <div className="gallery-dialog-inner">
            <button
              className="icon-button dialog-close"
              onClick={() => setGalleryIndex(null)}
              aria-label="Đóng ảnh không gian"
              autoFocus
            >
              <Icon name="close" />
            </button>
            <img src={gallery[galleryIndex].image} alt={gallery[galleryIndex].title} />
            <div className="gallery-dialog-caption">
              <div>
                <h2 id="gallery-dialog-title">{gallery[galleryIndex].title}</h2>
                <p>{gallery[galleryIndex].description}</p>
              </div>
              <div className="gallery-pagination">
                <button
                  className="icon-button previous-photo"
                  onClick={() =>
                    setGalleryIndex((galleryIndex + gallery.length - 1) % gallery.length)
                  }
                  aria-label="Ảnh trước"
                >
                  <Icon name="arrow" />
                </button>
                <span>
                  {galleryIndex + 1} / {gallery.length}
                </span>
                <button
                  className="icon-button"
                  onClick={() => setGalleryIndex((galleryIndex + 1) % gallery.length)}
                  aria-label="Ảnh tiếp theo"
                >
                  <Icon name="arrow" />
                </button>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </>
  )
}

export default App
