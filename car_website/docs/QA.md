# Kiểm tra landing page Apex Motors

Ngày kiểm tra: 24/09/2026. Trình duyệt: Chrome headless trên Windows.

## Kết quả

- TypeScript strict + production build: đạt.
- Oxlint: đạt.
- Playwright: 15/15 bài đạt.
- Hero hiển thị ngay với ảnh tĩnh, tiêu đề và CTA, kèm animation xuất hiện nhẹ; không video, canvas, vùng pin hay chuỗi frame.
- Cuộn từ hero tới các section và trở về đầu trang theo luồng trang thông thường.
- Responsive: 320 × 568, 375 × 667, 390 × 844, 430 × 932, 768 × 1024, 844 × 390; thêm điện thoại touch xoay ngang.
- Không tràn ngang; navbar cố định, menu focus trap, Escape, trả focus và offset anchor đạt.
- Skip link tới main, chữ phóng lớn 200% trên mobile và reduced motion lúc tải/đổi trong phiên: đạt.
- Ảnh hero lỗi vẫn giữ tiêu đề, CTA và navigation hoạt động.
- Gallery mở/đóng, phím mũi tên, Escape, chọn chi tiết xe và booking concept dialog: đạt.
- Axe WCAG 2 A/AA và 2.1 AA trên trang và menu mobile đang mở: không có violation trong phạm vi tự động.
- Đã xem ảnh chụp desktop, điện thoại 375 px và điện thoại xoay ngang.
- Build chỉ còn bundle trang; không còn chunk GSAP/ScrollTrigger. JavaScript production khoảng 75.60 kB gzip.

Ảnh kiểm thử nằm ở `test-results/`, báo cáo ở `playwright-report/`. Ảnh hero được preload trực tiếp từ cùng cấu hình `hero.image` dùng trong component.

## Giới hạn kiểm tra

- Chưa kiểm tra trên Safari/iPhone thật.
- Chưa chạy lại Lighthouse cho landing mới; số Lighthouse trong báo cáo của bản scroll trước không áp dụng cho lần thay đổi này.
- Ảnh nguồn vẫn có watermark và thay đổi mẫu xe; xem [MEDIA.md](MEDIA.md).
- Booking và social chưa có URL thực tế; vẫn dùng thông báo concept.
