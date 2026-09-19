# Nâu Coffee — React + TypeScript + Vite

Landing page quán cà phê với bảng màu nâu espresso và kem ấm, dùng TypeScript strict,
Vite, CSS thuần và Oxlint. Hướng thiết kế được ghi trong `design-system/MASTER.md`.

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

Ảnh từ Unsplash:

- [Cà phê latte](https://unsplash.com/photos/O_7Eev-wA0k): `hero-coffee.webp`.
- [Cà phê sữa đá](https://images.unsplash.com/photo-1461023058943-07fcbe16d735): `iced-coffee.webp`.
- [Cà phê đen](https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd): `espresso.webp`.
- [Croissant](https://images.unsplash.com/photo-1555507036-ab1f4038808a): `croissant.webp`.
- [Quầy cà phê](https://images.unsplash.com/photo-1640506780126-1e0836e462cb): `cafe-interior.webp`.
- [Góc bên cửa sổ](https://images.unsplash.com/photo-1445116572660-236099ec97a0): `cafe-corner.webp`.
- [Trà](https://images.unsplash.com/photo-1544787219-7f47ccb76574): `tea.webp`.

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
