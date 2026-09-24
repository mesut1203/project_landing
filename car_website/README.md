# Apex Motors

Landing page giới thiệu xe bằng React, TypeScript, Vite và Tailwind CSS. Hero dùng ảnh tĩnh, nội dung hiển thị ngay và các section cuộn theo luồng trang thông thường.

## Chạy dự án

```sh
npm install
npm run dev
```

Trên Windows PowerShell có thể dùng `npm.cmd` thay `npm`.

- `npm run lint`: kiểm tra mã nguồn bằng Oxlint.
- `npm run build`: kiểm tra TypeScript strict và tạo bản production trong `dist/`.
- `npm run preview`: xem bản production.
- `npm run test`: kiểm tra bằng Playwright/Chrome và axe accessibility.

## Cấu trúc trang

Copy, CTA và đường dẫn ảnh nằm trong [src/data/content.ts](src/data/content.ts).

- `Hero.tsx`: hero ảnh tĩnh, tiêu đề và CTA xuất hiện ngay.
- `Navbar.tsx`, `MobileMenu.tsx`: navigation cố định, skip link, native dialog và hỗ trợ bàn phím.
- `ModelSection.tsx`, `PerformanceSection.tsx`, `Gallery.tsx`, `FinalCTA.tsx`, `Footer.tsx`: nội dung landing và tương tác xem ảnh/chi tiết xe.

Website không phát video intro, tải chuỗi frame, pin section hoặc ẩn nội dung chờ cuộn. Hero xuất hiện nhẹ trong 380–400 ms; menu, chi tiết xe và hộp thoại chuyển trạng thái trong 200–220 ms. Các hiệu ứng tôn trọng reduced motion.

Booking và social chưa có URL thật nên hiện thông báo concept khi được chọn, không gửi dữ liệu hoặc tạo xác nhận đặt lịch giả.

Xem [DESIGN.md](docs/DESIGN.md) và [QA.md](docs/QA.md). Kiểm thử Chrome giả lập không thay thế kiểm thử trên iPhone/Safari thật.
