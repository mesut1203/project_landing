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
- src/index.css: Tailwind, tokens và giao diện responsive.
- public/media/: ảnh chụp cho các section.
- tests/landing.spec.ts: kiểm tra trên trình duyệt.
- scripts/fetch-media.mjs: tải lại ảnh stock từ nguồn đã chọn.

## Thiết kế

Quiet luxury với bố cục editorial bất đối xứng và các khung hình sắc cạnh.
Cormorant Garamond cho tiêu đề khách sạn, Manrope cho nội dung và điều khiển.
Font được đóng gói cục bộ, không gọi Google Fonts khi mở trang.

| Token | Giá trị |
| --- | --- |
| Charcoal | #202520 |
| Ivory | #f5f3ec |
| Champagne | #d4c3a3 |
| Forest | #35493e |

Design-taste: variance 7 (Rooms bất đối xứng), motion 1 (chuyển động nhẹ),
density 3 (nhiều khoảng thở). Các vùng sáng/tối và màu sắc theo brief Aurelia.

## Chuyển động và media

Hero dùng ảnh tĩnh; cả bốn không gian hiển thị theo luồng trang bình thường.
Không có canvas, ghim màn hình hay tải chuỗi frame khi cuộn.
Reveal chạy một lần trong 250 ms, dịch 6px và tăng opacity từ 0.9 lên 1.
Hover ảnh phóng nhẹ 1.015 lần trong 250 ms. Chế độ prefers-reduced-motion
tắt các hiệu ứng này và được cập nhật khi người dùng đổi thiết lập.
Explore the rooms đưa người dùng tới Rooms và chuyển focus.

Đã xóa ZIP nguồn và bộ 170 frame không còn dùng. Bốn ảnh tĩnh được giữ tại
public/media/arrival-{entrance,lobby,suite,view}.jpg từ bộ ảnh cũ.
Các ảnh này có watermark và chưa xác minh là cảnh khách sạn thật.
Ảnh các section là ảnh stock minh họa từ Unsplash, được lưu cục bộ.
Nguồn nằm trong photoSources tại content.ts; tải lại bằng node scripts/fetch-media.mjs.

## Form và tương tác

Form kiểm tra ngày bắt buộc, check-in không ở quá khứ, check-out sau check-in.
Ngày tối thiểu tính theo giờ địa phương.
Dữ liệu không gửi đi hoặc lưu trong storage; thông báo thành công nói rõ chưa tạo booking.

Khi kết nối booking service, thay xử lý submit trong BookingForm.tsx,
thêm trạng thái chờ/lỗi từ dịch vụ và cập nhật thông báo trong content.ts.

Experiences có tabs dùng Arrow keys, Home, End và roving tabIndex.
Menu mobile hỗ trợ Escape và trả focus về nút mở.

## Kiểm tra

Playwright dùng channel msedge (Edge có sẵn trên máy).
Máy không có Edge: chạy `npx playwright install chromium` và bỏ channel
trong playwright.config.ts.

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
