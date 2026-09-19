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

Chỉnh copy, CTA, nhãn, SEO, cấu hình chuỗi ảnh và đường dẫn media tại
[src/data/content.ts](src/data/content.ts). Metadata HTML cũng được Vite lấy từ file này.

- src/App.tsx: ghép các section.
- src/components/: Navbar, ScrollStory, Rooms, Dining, Experiences, BookingForm, Footer; Media và Reveal dùng chung.
- src/lib/sequence-player.ts: tải frame và render canvas.
- src/index.css: Tailwind, tokens và giao diện responsive.
- public/media/story/: 170 JPEG frame.
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

Design-taste: variance 7 (Rooms bất đối xứng), motion 6 (camera là câu chuyện chính),
density 3 (nhiều khoảng thở). Các vùng sáng/tối và màu sắc theo brief Aurelia.

## Scroll story

Native scrolling với stage position: sticky; không chặn wheel/touch.
Motion useScroll/useSpring làm mượt tiến trình phát media, không thay đổi vị trí cuộn native.
Tiến trình ánh xạ tới 170 frame của một hành trình có sẵn. Canvas render frame;
CSS/Motion chỉ animate transform và opacity.

Mỗi scene có khoảng cuộn riêng. Chữ cảnh trước biến mất trước khi chữ cảnh sau hiện.
Bộ tải có tối đa 4 yêu cầu đồng thời, timeout và cache đã decode tối đa
30 frame desktop / 18 frame mobile. Lỗi chuỗi ảnh chuyển sang poster;
nếu poster cũng lỗi, nền và thao tác vẫn dùng được.

Mobile portrait hiển thị đầy đủ khung 16:9 với nội dung bên dưới trong stage.
Không có chuỗi phim 9:16 riêng. Các màn hình thấp/xoay ngang có bố cục riêng.

prefers-reduced-motion được theo dõi cả khi đổi giữa phiên: bỏ canvas/pinned track,
chỉ tải frame cuối, hiển thị cả bốn scene theo luồng trang bình thường.
Skip experience đưa người dùng tới Rooms và chuyển focus.

## Media và nguồn

Hero lấy nguyên 170 JPEG 1280×720 từ file có sẵn
src/assets/ezgif-1efa68ec422030bb-jpg.zip (khoảng 3.88 MB).
Bộ ảnh có watermark; chưa xác minh được là footage quay thật.
Không tạo clip mới và không sử dụng credit Monid/Higgsfield.
Đây là giới hạn media hiện tại, không phải nguồn quay đã được xác minh.

Ảnh các section là ảnh stock từ Unsplash minh họa thương hiệu giả định.
Nguồn tải chính xác được lưu trong photoSources tại content.ts;
[giấy phép Unsplash](https://unsplash.com/license).
Ảnh đã lưu cục bộ, website không phụ thuộc vào hotlink khi chạy.

Tải lại ảnh stock: `node scripts/fetch-media.mjs`.

Để thay chuỗi ảnh, đưa frame vào public/media/story/, cập nhật
content.story.sequence, poster của bốn scene và finalImage.
Giữ thứ tự liên tục của footage gốc, kiểm tra lại mốc scene.
Không xóa ZIP nguồn nếu chưa được yêu cầu.

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

Bộ kiểm tra gồm scroll tiến/lùi và mốc scene, Skip/focus, form demo, tabs bàn phím,
mobile 320px/390px và landscape, CPU throttle 4×, reduced motion lúc tải trang
và lúc đổi giữa phiên, cùng lỗi media.
Screenshot QA lưu trong .tmp/screenshots/ (không commit).

Đã kiểm tra trên Edge/Chromium giả lập mobile; chưa kiểm tra trên thiết bị iOS Safari thật.

Quy ước làm việc trong [Agent.md](Agent.md).


Lần đo Lighthouse trên bản production cục bộ, mobile giả lập: Performance 95,
Accessibility 100, Best Practices 100, SEO 100; LCP 2.6s, TBT 20ms, CLS 0.001.
Kết quả phụ thuộc thiết bị, mạng và hosting; không phải đo người dùng thực tế.
Báo cáo nằm ở .tmp/lighthouse-final.json. Lighthouse đã tạo đủ báo cáo nhưng
CLI gặp lỗi EPERM khi dọn profile Edge tạm trên Windows sau khi hoàn tất.
