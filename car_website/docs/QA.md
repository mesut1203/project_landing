# Kiểm tra bản xem thử Apex Motors

Ngày kiểm tra: 14/09/2026. Trình duyệt: Chrome headless trên Windows.

## Kết quả

- TypeScript strict + production build: đạt.
- Oxlint: không có lỗi hoặc cảnh báo.
- Suite Playwright 18 bài: đạt. Sau các thay đổi preload và tách GSAP, các bài liên quan tới scrub, responsive, reduced motion, lỗi tải frame, accessibility và section rendering đã được chạy lại và đạt.
- Kích thước: 320 × 568, 375 × 667, 390 × 844, 430 × 932, 768 × 1024, 844 × 390; thêm context touch xoay từ portrait sang landscape.
- Kiểm tra tràn ngang, nav cố định, menu focus trap, Escape, trả focus và offset anchor: đạt.
- Scrub tiến/lùi, clamp chỉ số, giới hạn cache, tải theo vùng, hủy request khi đổi breakpoint: đạt.
- Reduced motion lúc tải trang và khi thay đổi trong phiên: không tải sequence, không pin, giữ nội dung truy cập được.
- Frame lỗi, poster lỗi và retry: đạt; các section khác vẫn sử dụng được.
- Gallery mở/đóng, phím mũi tên, Escape và booking concept dialog: đạt.
- Axe WCAG 2 A/AA và 2.1 AA trên trang và menu mobile đang mở: không có violation trong phạm vi kiểm tra tự động.

## Lighthouse trên bản build

Report cuối: `tmp/lighthouse-final.json`, thời điểm `2026-09-14T09:34:58.280Z`, cấu hình mobile mặc định của Lighthouse.

| Hạng mục | Kết quả |
| --- | --- |
| Performance | 96 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |
| LCP | 2.6 s |
| CLS | 0.009 |
| Total blocking time | 0 ms |
| Browser console errors | 0 |

Report được xuất đầy đủ. Lệnh Lighthouse sau đó trả mã lỗi do Windows báo `EPERM` khi Chrome Launcher dọn thư mục profile tạm; đây không phải một lần chạy CLI có exit code 0. Các số trên được đọc từ report JSON đã xuất, là phép đo phòng lab và có thể thay đổi theo máy/mạng.

JavaScript tải đầu đã giảm từ khoảng 124 kB gzip xuống 80 kB gzip. GSAP/ScrollTrigger chỉ được import khi story động được bật; mobile fallback tĩnh không cần tải các chunk đó.

## Chưa thể xác nhận

- Phim portrait 9:16 và pacing thực tế của chain portrait: nguồn chưa có.
- Continuity camera, cùng mẫu xe và không watermark: bộ nguồn hiện tại không đạt; xem `MEDIA.md`.
- Safari/iPhone thật và FPS trên thiết bị yếu: chưa có kiểm tra thiết bị thật.
- Booking và social thực tế: chưa có URL; hiện dùng thông báo concept trung thực.
