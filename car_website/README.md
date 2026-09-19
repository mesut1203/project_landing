# Apex Motors

Landing page automotive cinematic bằng React, TypeScript, Vite và Tailwind CSS. Dùng frame từ ZIP người dùng cung cấp, GSAP ScrollTrigger và canvas để scrub theo native scroll.

## Chạy dự án

```sh
npm install
npm run dev
```

Trên Windows PowerShell có thể dùng `npm.cmd` thay `npm`.

```sh
npm run typecheck
npm run lint
npm run build
npm run preview
npm run test
npm run media:prepare
```

- `build` kiểm tra TypeScript strict rồi xuất website vào `dist/`.
- `test` dùng Playwright và Chrome đã cài trên máy, có kiểm tra axe accessibility.
- `media:prepare` tạo lại ảnh WebP và sequence từ `src/assets/ezgif-7893fd5aaba20c46-jpg.zip`.
- Báo cáo kiểm thử nằm trong `playwright-report/`; ảnh chụp ở `test-results/`.

## Nội dung và cấu hình

Toàn bộ copy, nhãn accessibility, CTA, media paths và scene pacing nằm trong [`src/data/content.ts`](src/data/content.ts).

Các component chính:

- `Navbar.tsx`, `MobileMenu.tsx`: navigation cố định, safe area, native dialog, focus trap, Escape, đóng sau khi chọn link.
- `ScrollStory.tsx`: stage sticky, progress và copy ba cảnh; reduced motion trở về normal document flow.
- `FrameSequence.tsx`: poster, canvas, loading, retry và fallback.
- `src/lib/FrameBuffer.ts`: tải progressive, hủy request và giải phóng decoded frames.
- `ModelSection.tsx`, `PerformanceSection.tsx`, `Gallery.tsx`, `FinalCTA.tsx`, `Footer.tsx`: phần nội dung chính và gallery có điều khiển bàn phím.

`booking.url` và các URL social hiện chưa có. Website hiển thị thông báo concept khi người dùng chọn các hành động này, không gửi dữ liệu hoặc tạo xác nhận đặt lịch giả.

## Trạng thái media

Desktop hiện có 160 WebP 1280 × 720, tổng khoảng 2.83 MiB. Mỗi lần chỉ tải một nhóm frame quanh vị trí scroll, giới hạn 20 decoded frames và 3 request đồng thời.

**Bộ nguồn có watermark, logo xe, thay đổi mẫu xe và các cú cắt. Chưa có video/sequence portrait 9:16.** Mobile vì vậy đang dùng ảnh final frame tĩnh 720 × 405 trong layout riêng, giữ trọn xe; không tải sequence landscape. Đây là bản xem thử, chưa đạt toàn bộ yêu cầu media cuối cùng của brief.

Xem [`docs/MEDIA.md`](docs/MEDIA.md) để thay bằng bộ landscape/portrait hoàn chỉnh, và [`docs/DESIGN.md`](docs/DESIGN.md) cho định hướng giao diện.

## Kiểm tra

Các bài Playwright kiểm tra:

- Frame mapping hợp lệ, tiến/lùi và liên tục về chỉ số ở biên scene.
- Loading progressive, giới hạn cache, hủy request khi đổi breakpoint.
- Responsive 320, 375, 390, 430, 768 và 844 px; thêm điện thoại touch xoay ngang.
- Navigation cố định, menu focus, Escape, focus restoration và anchor offset.
- Reduced motion lúc khởi động và khi thay đổi trong phiên.
- Poster fallback, lỗi tải frame, retry, gallery keyboard và dialog booking.
- Accessibility tự động bằng axe.

Kiểm tra trong Chrome giả lập không thay thế kiểm thử trên iPhone/Safari thật. Tính liền mạch của camera phải được kiểm tra lại khi có bộ media sạch; việc chỉ số frame nối đúng không sửa được cú cắt trong video nguồn.
