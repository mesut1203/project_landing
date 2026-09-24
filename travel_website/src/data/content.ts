export type DestinationCategory = 'all' | 'mountain' | 'coast' | 'town'

export const content = {
  brand: {
    name: 'Nomad',
    country: 'VIETNAM',
    fullName: 'Nomad Vietnam',
    signature: 'Đi xa hơn. Sống chậm lại.',
  },
  a11y: {
    skipToContent: 'Đi tới nội dung chính',
    navigation: 'Điều hướng chính',
    openMenu: 'Mở menu',
    closeMenu: 'Đóng menu',
    home: 'Nomad Vietnam — về đầu trang',
    filter: 'Lọc theo trải nghiệm',
    footerNav: 'Điều hướng cuối trang',
  },
  nav: [
    { label: 'Tinh thần Nomad', href: '#our-story' },
    { label: 'Điểm đến', href: '#destinations' },
    { label: 'Lên đường', href: '#plan-trip' },
  ],
  hero: {
    eyebrow: 'VIETNAM, AT YOUR OWN PACE',
    heading: 'Đi xa hơn.',
    emphasis: 'Sống chậm lại.',
    description:
      'Theo một con đường nhỏ, tìm một vùng trời rộng. Một Việt Nam rất khác đang chờ bạn.',
    cta: 'Tìm hành trình của bạn',
    secondary: 'Khám phá tinh thần Nomad',
    noteLabel: 'THE ART OF GETTING LOST',
    scroll: 'CHẬM LẠI & KHÁM PHÁ',
  },
  story: {
    eyebrow: 'TINH THẦN NOMAD',
    heading: 'Không chỉ đi qua.',
    emphasis: 'Hãy ở trong khoảnh khắc.',
    description:
      'Một buổi sáng chưa có lịch trình. Một ly cà phê bên hiên nhà. Một khúc quanh khiến bạn muốn dừng lại. Chúng tôi tin những điều nhỏ bé ấy làm nên một chuyến đi đáng nhớ.',
    image: '/images/traveler.webp',
    imageAlt: 'Người lữ hành đeo ba lô nhìn về những dãy núi trong nắng chiều',
    imageCaption: 'LESS RUSH. MORE WONDER.',
    principles: [
      {
        number: '01',
        title: 'Đi theo sự tò mò',
        text: 'Dành chỗ cho những ngã rẽ và những cuộc gặp không hẹn trước.',
      },
      {
        number: '02',
        title: 'Chạm vào đời sống',
        text: 'Nghe câu chuyện địa phương, thử một món quen theo cách mới.',
      },
      {
        number: '03',
        title: 'Để lại sự nhẹ nhàng',
        text: 'Tôn trọng thiên nhiên, văn hóa và nhịp sống của nơi mình đến.',
      },
    ],
  },
  destinations: {
    eyebrow: 'CHỌN MỘT KHOẢNG TRỜI',
    heading: 'Bạn muốn thức dậy',
    emphasis: 'ở đâu?',
    description:
      'Lên núi đón mây, ra biển nghe sóng, hay lạc giữa những mái ngói cũ. Hành trình bắt đầu từ điều bạn yêu.',
    choose: 'Chọn hành trình',
    imageNote:
      'Hình ảnh mang tính gợi cảm hứng; hành trình bên dưới là ý tưởng tham khảo.',
    filters: [
      { id: 'all', label: 'Tất cả' },
      { id: 'mountain', label: 'Miền núi' },
      { id: 'coast', label: 'Miền biển' },
      { id: 'town', label: 'Phố cổ' },
    ] as { id: DestinationCategory; label: string }[],
    items: [
      {
        id: 'mountains',
        category: 'mountain',
        number: '01',
        name: 'Theo những tầng mây',
        location: 'CẢM HỨNG MIỀN NÚI',
        mood: 'Cung đường & bình minh',
        image: '/images/mountains.webp',
        alt: 'Con đường uốn quanh sườn núi giữa những tầng mây',
        description:
          'Đi bộ giữa núi đồi, đón nắng sớm và dành cả buổi chiều cho một khung cửa nhìn ra thung lũng.',
      },
      {
        id: 'coast',
        category: 'coast',
        number: '02',
        name: 'Về phía biển xanh',
        location: 'CẢM HỨNG MIỀN BIỂN',
        mood: 'Biển xanh & ngày chậm',
        image: '/images/coast.webp',
        alt: 'Chiếc thuyền gỗ trên làn nước xanh ngọc bên bờ đá',
        description:
          'Theo con đường ven biển, dừng ở một vịnh nhỏ và để tiếng sóng thay cho chuông báo thức.',
      },
      {
        id: 'hoi-an',
        category: 'town',
        number: '03',
        name: 'Lạc trong phố Hội',
        location: 'HỘI AN',
        mood: 'Phố cổ & những câu chuyện',
        image: '/images/hoi-an.webp',
        alt: 'Con phố Hội An với những ngôi nhà vàng và đèn lồng',
        description:
          'Đi qua những bức tường vàng, ngồi bên một hiên nhà cũ và nhìn phố dần lên đèn.',
      },
    ],
    count: (count: number) => `${count} ý tưởng hành trình`,
  },
  interlude: {
    image: '/images/slow-evening.webp',
    eyebrow: 'TAKE THE LONG WAY HOME',
    line: 'Đi để thấy thế giới.',
    emphasis: 'Chậm lại để thấy mình.',
  },
  form: {
    eyebrow: 'CHUYẾN ĐI CỦA RIÊNG BẠN',
    heading: 'Một ý tưởng nhỏ.',
    emphasis: 'Một hành trình mới.',
    description:
      'Bắt đầu bằng nơi bạn muốn đến và nhịp điệu bạn yêu. Phần còn lại, hãy để trí tò mò dẫn đường.',
    demoLabel: 'BẢN TRẢI NGHIỆM',
    demoNotice:
      'Đây là form demo, chưa kết nối dịch vụ booking. Thông tin chỉ hiển thị trên trang, không được gửi đi hay lưu trữ.',
    requiredHint: '* Thông tin bắt buộc',
    name: 'Tên của bạn',
    namePlaceholder: 'Bạn muốn được gọi là gì?',
    destination: 'Khoảng trời bạn chọn',
    destinationPlaceholder: 'Chọn một hành trình',
    flexible: 'Tôi vẫn đang tìm cảm hứng',
    month: 'Tháng dự kiến',
    pace: 'Nhịp điệu chuyến đi',
    paceOptions: [
      'Thật chậm, thật thư thả',
      'Khám phá và nghỉ ngơi',
      'Ưa những cung đường mới',
    ],
    submit: 'Tạo ý tưởng chuyến đi',
    errorName: 'Vui lòng nhập tên của bạn (ít nhất 2 ký tự).',
    errorDestination:
      'Hãy chọn một hành trình hoặc chọn vẫn đang tìm cảm hứng.',
    errorMonth: 'Hãy chọn tháng hiện tại hoặc một tháng trong tương lai.',
    successTitle: 'Ý tưởng của bạn đã có hình hài.',
    success: (name: string) =>
      `${name}, đây là phác thảo cho chuyến đi tiếp theo của bạn.`,
    summaryLabels: {
      destination: 'ĐIỂM ĐẾN',
      month: 'KHI NÀO',
      pace: 'NHỊP ĐIỆU',
    },
    undecided: 'Khi bạn sẵn sàng',
  },
  footer: {
    description: 'Những cung đường mới.\nNhững điều thật gần.',
    note: 'Một concept du lịch chậm tại Việt Nam.',
    backToTop: 'Về đầu trang',
    copyright: '© Nomad Vietnam',
    photoCredit: 'Ảnh Hội An · Unsplash',
    photoUrl: 'https://unsplash.com/photos/KpJ1_47WQPc',
  },
}
