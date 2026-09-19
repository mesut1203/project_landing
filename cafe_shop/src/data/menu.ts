export type Category = 'coffee' | 'tea' | 'bakery'

export type MenuItem = {
  id: string
  name: string
  english: string
  description: string
  price: number
  image: string
  category: Category
  label?: string
  ingredients: string
  note: string
  serving: string
}

export const categories: { id: Category; name: string }[] = [
  { id: 'coffee', name: 'Cà phê' },
  { id: 'tea', name: 'Trà & thức uống' },
  { id: 'bakery', name: 'Bánh nhà làm' },
]

export const menuItems: MenuItem[] = [
  {
    id: 'nau-sua',
    name: 'Nâu sữa đá',
    english: 'VIETNAMESE ICED COFFEE',
    description: 'Đậm vị cà phê, ngọt vừa đủ thương.',
    price: 45000,
    image: '/images/iced-coffee.webp',
    category: 'coffee',
    label: 'VỊ QUEN CỦA NÂU',
    ingredients: 'Cà phê Robusta, sữa đặc, đá viên.',
    note: 'Có sữa. Có caffeine.',
    serving: 'Dùng lạnh · 250 ml',
  },
  {
    id: 'latte',
    name: 'Latte êm',
    english: 'SIGNATURE LATTE',
    description: 'Một lớp sữa mịn, một ngày dịu dàng.',
    price: 55000,
    image: '/images/hero-coffee.webp',
    category: 'coffee',
    ingredients: 'Espresso Arabica, sữa tươi thanh trùng.',
    note: 'Có sữa. Có caffeine.',
    serving: 'Nóng hoặc lạnh · 250 ml',
  },
  {
    id: 'espresso',
    name: 'Espresso nguyên bản',
    english: 'DOUBLE ESPRESSO',
    description: 'Hương hạt rang, hậu vị chocolate.',
    price: 40000,
    image: '/images/espresso.webp',
    category: 'coffee',
    ingredients: 'Hai shot espresso từ hạt Arabica rang vừa.',
    note: 'Có caffeine. Không thêm đường hoặc sữa.',
    serving: 'Dùng nóng · 60 ml',
  },
  {
    id: 'bac-xiu',
    name: 'Bạc xỉu',
    english: 'MILK COFFEE',
    description: 'Nhiều sữa một chút, nhẹ lòng một chút.',
    price: 45000,
    image: '/images/iced-coffee.webp',
    category: 'coffee',
    ingredients: 'Sữa tươi, sữa đặc, một shot cà phê.',
    note: 'Có sữa. Có caffeine.',
    serving: 'Dùng lạnh · 300 ml',
  },
  {
    id: 'americano',
    name: 'Americano',
    english: 'BLACK COFFEE',
    description: 'Trong trẻo, thơm nhẹ và thật nguyên bản.',
    price: 45000,
    image: '/images/espresso.webp',
    category: 'coffee',
    ingredients: 'Espresso Arabica, nước lọc.',
    note: 'Có caffeine. Không thêm đường hoặc sữa.',
    serving: 'Nóng hoặc lạnh · 250 ml',
  },
  {
    id: 'cappuccino',
    name: 'Cappuccino',
    english: 'CLASSIC CAPPUCCINO',
    description: 'Espresso đậm đà dưới lớp bọt sữa mềm.',
    price: 55000,
    image: '/images/hero-coffee.webp',
    category: 'coffee',
    ingredients: 'Espresso, sữa tươi, bọt sữa.',
    note: 'Có sữa. Có caffeine.',
    serving: 'Dùng nóng · 180 ml',
  },
  {
    id: 'tra-nhai',
    name: 'Trà nhài thanh',
    english: 'JASMINE TEA',
    description: 'Hương hoa nhẹ nhàng, dư vị an yên.',
    price: 45000,
    image: '/images/tea.webp',
    category: 'tea',
    label: 'MỘT CHÚT THANH',
    ingredients: 'Trà xanh ướp hoa nhài, nước lọc.',
    note: 'Có caffeine. Có thể chọn không đường.',
    serving: 'Nóng hoặc lạnh · 350 ml',
  },
  {
    id: 'tra-mat-ong',
    name: 'Trà mật ong',
    english: 'HONEY TEA',
    description: 'Ngọt lành, ấm áp như một lời hỏi thăm.',
    price: 50000,
    image: '/images/tea.webp',
    category: 'tea',
    ingredients: 'Trà đen, mật ong, chanh vàng.',
    note: 'Có mật ong và caffeine.',
    serving: 'Nóng hoặc lạnh · 350 ml',
  },
  {
    id: 'tra-cam',
    name: 'Trà cam quế',
    english: 'ORANGE CINNAMON TEA',
    description: 'Cam tươi và quế, thơm cả buổi chiều.',
    price: 55000,
    image: '/images/tea.webp',
    category: 'tea',
    ingredients: 'Trà đen, cam tươi, quế, đường mía.',
    note: 'Có caffeine. Có thể điều chỉnh độ ngọt.',
    serving: 'Dùng nóng · 350 ml',
  },
  {
    id: 'croissant',
    name: 'Croissant bơ',
    english: 'BUTTER CROISSANT',
    description: 'Vỏ giòn từng lớp, thơm bơ mỗi sớm.',
    price: 45000,
    image: '/images/croissant.webp',
    category: 'bakery',
    label: 'HỢP CÙNG CÀ PHÊ',
    ingredients: 'Bột mì, bơ, sữa, men, trứng.',
    note: 'Có gluten, sữa và trứng.',
    serving: 'Một chiếc · phục vụ ấm',
  },
  {
    id: 'croissant-honey',
    name: 'Croissant mật ong',
    english: 'HONEY CROISSANT',
    description: 'Một chút mật ngọt trên lớp bánh giòn.',
    price: 50000,
    image: '/images/croissant.webp',
    category: 'bakery',
    ingredients: 'Bột mì, bơ, sữa, men, trứng, mật ong.',
    note: 'Có gluten, sữa, trứng và mật ong.',
    serving: 'Một chiếc · phục vụ ấm',
  },
  {
    id: 'croissant-almond',
    name: 'Croissant hạnh nhân',
    english: 'ALMOND CROISSANT',
    description: 'Bùi thơm hạnh nhân, vừa vặn buổi trà.',
    price: 55000,
    image: '/images/croissant.webp',
    category: 'bakery',
    ingredients: 'Bột mì, bơ, sữa, men, trứng, hạnh nhân.',
    note: 'Có gluten, sữa, trứng và hạt hạnh nhân.',
    serving: 'Một chiếc · phục vụ ấm',
  },
]

export const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(price)
