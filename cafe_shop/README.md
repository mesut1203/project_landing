# Nâu Coffee — React + TypeScript + Vite

Landing page quán cà phê theo hướng atelier đương đại: nền espresso, điểm nhấn
đồng ấm, chữ Archivo lớn, bố cục ảnh lệch trục và đường chia theo tinh thần Swiss
industrial. Không còn thanh điều hướng dọc và giao diện nhật ký giấy.

Chuyển động dùng các component React Bits chính thức (SplitText, ScrollVelocity,
TiltedCard), GSAP và Motion. Dải chữ có nút tạm dừng; hiệu ứng nghiêng chỉ bật với
con trỏ chính xác. Chế độ giảm chuyển động hiển thị nội dung tĩnh. ScrollTrigger
và các animation được dọn khi component unmount hoặc đổi cài đặt hệ thống.
Dùng TypeScript strict, Vite, CSS thuần và Oxlint.

## Chức năng

- Lọc thực đơn theo nhóm cà phê, trà và bánh; mở rộng danh sách cà phê.
- Xem giá, thành phần và lưu ý của từng món trong cửa sổ chi tiết.
- Lưu/bỏ lưu món yêu thích trên thiết bị bằng localStorage, giữ lại sau khi tải lại trang.
- Xem ảnh không gian, chuyển ảnh trước/sau và đóng bằng Escape.
- Điều hướng mobile, liên kết đến từng phần và mở Google Maps.
- Hỗ trợ bàn phím, giảm chuyển động theo cài đặt hệ thống và bố cục responsive.

Đây là concept thiết kế: tên quán, địa chỉ, giờ mở cửa, giá và thành phần là nội dung
minh họa. Ảnh món cũng mang tính minh họa. Không có backend, thanh toán hoặc đặt bàn.

## Chạy dự án

```powershell
npm.cmd install
npm.cmd run dev
```

Mở địa chỉ Vite hiển thị trong terminal (mặc định là http://localhost:5173).
Chỉnh giao diện và thông tin quán tại `src/App.tsx`, dữ liệu món tại `src/data/menu.ts`,
bố cục tại `src/App.css` và màu/font tại `src/index.css`.
Điểm khởi chạy React là `src/main.tsx`.

## Tài nguyên

Ảnh WebP và font WOFF2 được lưu trong `public/`; trang không cần tải ảnh hay font từ
dịch vụ bên ngoài trong lúc chạy. Ảnh dưới fold dùng lazy loading.

Mười bảy ảnh được tạo riêng bằng công cụ imagegen tích hợp và tối ưu WebP trong
`public/images/editorial/`. Toàn bộ ảnh gốc và ảnh chụp giao diện cũ đã được xóa.

| Tệp | Nội dung / hướng ảnh |
| --- | --- |
| `ritual.webp` | Tách sứ và phin Việt, bàn gỗ, ánh sáng tự nhiên trong quán Sài Gòn |
| `iced.webp` | Cà phê sữa đá trong ly thủy tinh, chi tiết đá và lớp sữa |
| `espresso.webp` | Espresso trong tách sứ nâu, lớp crema và hạt rang |
| `pastry.webp` | Croissant bơ trên đĩa sứ, lớp vỏ bánh và vải linen |
| `jasmine.webp` | Trà nhài, ấm sứ và hoa trắng, ánh nắng qua cửa chớp |
| `house.webp` | Quầy gỗ, ghế mây, tường vôi và cửa chớp xanh của quán |
| `window.webp` | Bàn nhỏ, sách và tách cà phê bên cửa sổ nhìn ra sân xanh |
| `latte.webp`, `milk-coffee.webp`, `americano.webp`, `cappuccino.webp` | Ảnh riêng cho latte, bạc xỉu, Americano và cappuccino |
| `honey-tea.webp`, `orange-tea.webp` | Trà mật ong chanh và trà cam quế |
| `honey-croissant.webp`, `almond-croissant.webp` | Croissant mật ong và croissant hạnh nhân |
| `counter.webp`, `conversation.webp` | Góc quầy pha chế và cuộc trò chuyện trong quán |

Mỗi món và mỗi vị trí ảnh trên trang có ảnh riêng; cửa sổ chi tiết hiển thị đúng ảnh món hoặc ảnh gallery đang chọn.

Hướng prompt chung: ảnh editorial chân thực, ánh sáng cửa sổ tự nhiên, chất liệu
gỗ/sứ/linen rõ nét, màu nâu–kem–olive dịu, không chữ/logo/watermark. Đây là hình
minh họa được tạo bằng AI, không phải ảnh chụp địa điểm hoặc thực đơn thật.

Font Be Vietnam Pro và Cormorant Garamond từ Google Fonts; giấy phép đi kèm ở
`public/fonts/BeVietnamPro-OFL.txt` và `public/fonts/CormorantGaramond-OFL.txt`.

## Kiểm tra và build

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
npm.cmd run preview
```

Lệnh `build` kiểm tra kiểu dữ liệu trước khi tạo bản production trong `dist/`.
Cấu hình TypeScript cho ứng dụng nằm trong `tsconfig.app.json`, còn cấu hình cho
`vite.config.ts` nằm trong `tsconfig.node.json`.

## Nguồn chuyển động và giấy phép

Component từ [React Bits](https://github.com/DavidHDev/react-bits), commit
`b6666e9f3a03a062143ce409f3aac53e27fdfaa8`, lưu ở `src/components/react-bits/`.
Bản sửa thêm chế độ giảm chuyển động, dừng marquee, chữ lặp ẩn với trình đọc màn
hình, ảnh tĩnh trên thiết bị cảm ứng và tối ưu cập nhật con trỏ. Giấy phép upstream
được giữ tại `public/licenses/react-bits-LICENSE.md`.

Archivo Variable và IBM Plex Mono được đóng gói cục bộ qua Fontsource; giấy phép
đặt trong `public/licenses/`. Be Vietnam Pro tiếp tục dùng cho nội dung tiếng Việt.
