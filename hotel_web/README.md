# Aurelia Hotel

Landing page boutique hotel: React 19, TypeScript strict, Vite 8, Tailwind CSS v4.

## Chạy dự án

Node.js 24 LTS và npm được dùng khi phát triển.

```bash
npm ci
npm run dev
```

Mở địa chỉ Vite in trong terminal, mặc định http://localhost:5173.
Trên PowerShell, dùng `npm.cmd` nếu execution policy chặn `npm.ps1`.

| Lệnh | Chức năng |
| --- | --- |
| `npm run dev` | Máy chủ phát triển |
| `npm run typecheck` | Kiểm tra TypeScript |
| `npm run lint` | Kiểm tra Oxlint |
| `npm run build` | Typecheck và build production vào dist/ |
| `npm run preview` | Xem bản production cục bộ |
| `npm test` | Kiểm tra tích hợp bằng Playwright |

## Nội dung và cấu trúc

Chỉnh copy, CTA, nhãn, SEO, đường dẫn ảnh tĩnh tại
[src/data/content.ts](src/data/content.ts). Metadata HTML cũng được Vite lấy từ file này.

- src/App.tsx: ghép các section.
- src/components/: Navbar, Hero, Rooms, Dining, Experiences, BookingForm, Footer; Media và Reveal dùng chung.
- src/index.css: Tailwind và các quy tắc nền.
- src/redesign.css: bố cục resort, bảng màu, responsive và tương tác hiện tại.
- public/media/: ảnh chụp cho các section.
- tests/landing.spec.ts: kiểm tra trên trình duyệt.

## Thiết kế

Không gian nghỉ dưỡng ven biển: hero ảnh tràn màn hình, tiêu đề serif đặt trên ảnh,
menu trong suốt theo luồng trang và form đặt ngày ở chân hero. Nội dung tiếp nối bằng
các ảnh không khung, khoảng trắng rộng và bố cục tạp chí xen kẽ.
Cormorant Garamond cho tiêu đề khách sạn, Manrope cho nội dung và điều khiển.
Font được đóng gói cục bộ, không gọi Google Fonts khi mở trang.

| Token | Giá trị |
| --- | --- |
| Charcoal | #353b33 |
| Ivory | #faf9f4 |
| Champagne | #c6b898 |
| Forest | #515c47 |

Design-taste: variance 7 (Rooms bất đối xứng), motion 1 (chuyển động nhẹ),
density 3 (nhiều khoảng thở). Các vùng sáng/tối và màu sắc theo brief Aurelia.

## Chuyển động và media

Hero dùng ảnh tĩnh; cả bốn không gian hiển thị theo luồng trang bình thường.
Không có canvas, ghim màn hình hay tải chuỗi frame khi cuộn.
Trên desktop, tiêu đề hero trượt lên theo hai nhịp; ảnh mở đầu chuyển nhẹ từ cận cảnh
ra khung rộng. Ảnh nội dung có lớp rèm mở bằng transform và chiều sâu parallax
nhẹ trong khung cố định. Reveal dịch 40px trong 1.15 giây, giữ nguyên opacity
để chữ và nhãn form luôn đủ tương phản.
Hover ảnh phòng phóng nhẹ trong khung; mũi tên và đường gạch liên kết chuyển động
nhẹ. Tabs trải nghiệm có chuyển cảnh theo chiều dọc. Mobile dùng ảnh tĩnh và
chuyển động tiêu đề/nội dung ngắn, không có parallax hoặc lớp rèm ảnh;
`prefers-reduced-motion` tắt chuyển động và được cập nhật ngay giữa phiên,
gỡ cả các component parallax và tiêu đề tách từ.
Explore the rooms đưa người dùng tới Rooms và chuyển focus.

Toàn bộ ảnh cũ đã được thay bằng ảnh minh họa mới tạo bằng image_gen.
Mỗi vị trí dùng một ảnh riêng: aurelia-coast, aurelia-pool, aurelia-retreat,
aurelia-balcony, aurelia-suite, aurelia-classic, aurelia-terrace-room,
aurelia-table, aurelia-headland, aurelia-spa và aurelia-rooftop.
Các file WebP nằm trong public/media/; đây là hình ảnh concept, không phải ảnh
của một khách sạn đã xác minh. Script tải ảnh stock cũ đã được xóa.

## Form và tương tác

Form kiểm tra ngày bắt buộc, check-in không ở quá khứ, check-out sau check-in.
Ngày tối thiểu tính theo giờ địa phương.
Dữ liệu không gửi đi hoặc lưu trong storage; thông báo thành công nói rõ chưa tạo booking.

Khi kết nối booking service, thay xử lý submit trong BookingForm.tsx,
thêm trạng thái chờ/lỗi từ dịch vụ và cập nhật thông báo trong content.ts.

Experiences có tabs dùng Arrow keys, Home, End và roving tabIndex.
Menu mobile hỗ trợ Escape và trả focus về nút mở.

## Kiểm tra

Playwright dùng Chromium mặc định. Chạy `npx playwright install chromium` nếu
chưa có trình duyệt; biến `PLAYWRIGHT_CHANNEL` cho phép chọn channel khác.
Máy chủ kiểm tra chạy riêng trên cổng 5188.

Bộ kiểm tra gồm cuộn tự nhiên, không tải sequence, liên kết và focus, form demo,
tabs bàn phím, mobile 320px/375px, tablet, landscape, reduced motion lúc tải trang
và lúc đổi giữa phiên, cùng lỗi ảnh.
Screenshot QA lưu trong .tmp/screenshots/ (không commit).

Đã kiểm tra trên Edge/Chromium giả lập mobile; chưa kiểm tra trên thiết bị iOS Safari thật.

Quy ước làm việc trong [Agent.md](Agent.md).


Lần đo Lighthouse trước thay đổi ảnh tĩnh (chưa đo lại) trên bản production cục bộ, mobile giả lập: Performance 95,
Accessibility 100, Best Practices 100, SEO 100; LCP 2.6s, TBT 20ms, CLS 0.001.
Kết quả phụ thuộc thiết bị, mạng và hosting; không phải đo người dùng thực tế.
Báo cáo nằm ở .tmp/lighthouse-final.json. Lighthouse đã tạo đủ báo cáo nhưng
CLI gặp lỗi EPERM khi dọn profile Edge tạm trên Windows sau khi hoàn tất.
