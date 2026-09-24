# Hướng dẫn agent — Aurelia Hotel

## Mục tiêu

Phát triển dự án `hotel_web` bằng React và Tailwind CSS. Giữ code dễ đọc,
component dễ tái sử dụng và chỉ thay đổi trong phạm vi yêu cầu của người dùng.
Trao đổi và viết tài liệu bằng tiếng Việt, trừ khi được yêu cầu khác.

## Công nghệ

- React 19 với TypeScript strict, TSX, function components và hooks.
- Vite 8 cho môi trường phát triển và build production.
- Tailwind CSS v4 qua plugin `@tailwindcss/vite`.
- Oxlint để kiểm tra code; cấu hình trong `.oxlintrc.json`.
- Motion cho reveal nhẹ; Playwright để kiểm tra trên trình duyệt.
- npm là trình quản lý package; giữ `package-lock.json` đồng bộ với `package.json`.

## Cấu trúc dự án

- `src/main.tsx`: khởi tạo React, font tự lưu và CSS toàn cục.
- `src/App.tsx`: ghép các section của landing page.
- `src/data/content.ts`: toàn bộ copy, CTA, nhãn hỗ trợ truy cập, SEO và đường dẫn media.
- `src/components/`: Navbar, Hero, Rooms, Dining, Experiences, BookingForm, Footer và component dùng chung.
- `src/index.css`: import Tailwind và định nghĩa CSS toàn cục.
- `src/assets/`: ảnh, icon và tài nguyên import trong code.
- `public/media/arrival-*.jpg`: bốn ảnh tĩnh của phần giới thiệu.
- `public/media/`: ảnh chụp cho các section, được lưu cục bộ.
- `tests/landing.spec.ts`: kiểm tra scroll, mobile, bàn phím, reduced motion, lỗi media và form.
- `vite.config.js`: cấu hình plugin React và Tailwind.
- Khi cần, tạo `src/components/`, `src/pages/`, `src/hooks/`, `src/lib/`;
  không tạo cấu trúc hoặc lớp trừu tượng chưa có nhu cầu sử dụng.

## Lệnh làm việc

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run build
npm test
npm run preview
```

- Dùng `npm ci` khi cần cài lại đúng phiên bản trong lockfile.
- Trên PowerShell, dùng `npm.cmd` nếu `npm.ps1` bị execution policy chặn.
- `npm run preview` cần chạy sau `npm run build`.
- `npm test` dùng Microsoft Edge headless. Máy khác có thể đổi channel trong `playwright.config.ts`.
- `npm run build` kiểm tra TypeScript trước khi build Vite; phân biệt lint, typecheck và browser tests khi báo kết quả.

## Quy ước code

- Component và tên file component dùng PascalCase; biến và hàm dùng camelCase.
- Dùng ES modules, thụt lề 2 dấu cách, chuỗi JavaScript dùng nháy đơn.
- Dùng interfaces cho props và data. Giữ nội dung tiếng Anh của thương hiệu trong `content.ts`.
- Giữ bảng màu charcoal, ivory, champagne và forest; font Cormorant Garamond và Manrope tự lưu.
- Giữ native scrolling; chỉ animate transform và opacity. Không chặn wheel hoặc touch để điều khiển cuộn.
- Reduced motion tắt reveal và hover transform; nội dung luôn theo luồng trang bình thường.
- Giữ liên kết Explore the rooms truy cập được bằng bàn phím trên mọi kích thước màn hình.
- Không thêm rating, testimonial, địa chỉ hoặc số liệu không được người dùng cung cấp.
- Form hiện là demo, không gửi dữ liệu; giữ thông báo rõ ràng đến khi có booking service thực.
- Ảnh tĩnh phần giới thiệu có sẵn, có watermark, chưa xác minh là cảnh quay thật. Không mô tả là footage đã được xác minh.
- Ưu tiên state cục bộ; tách component khi có trách nhiệm riêng hoặc được tái sử dụng.
- Tuân thủ Rules of Hooks và dọn dẹp các effect có đăng ký sự kiện hoặc timer.
- Dùng Tailwind trong `className`; CSS dùng chung đặt trong `src/index.css`.
- Tailwind v4 đã được cấu hình qua Vite và `@import "tailwindcss";`.
  Chỉ thêm cấu hình khác khi có nhu cầu cụ thể.
- Viết đầy đủ tên utility class; tránh ghép chuỗi động như `bg-${color}-500`.
  Dùng bảng ánh xạ chứa các class hoàn chỉnh khi cần biến thể.
- Giao diện cần responsive, HTML có ngữ nghĩa, label cho input, alt cho ảnh
  và trạng thái focus rõ ràng cho thao tác bàn phím.
- Không đưa khóa API hoặc thông tin bí mật vào frontend. Biến `VITE_*`
  được đưa vào bundle và có thể được người dùng xem.
- Không sửa trực tiếp `node_modules/` hoặc `dist/`.
- Chỉ thêm thư viện khi cần và cập nhật tài liệu nếu thay đổi cách chạy dự án.

## Quy trình kiểm tra

1. Đọc cấu hình và code liên quan trước khi sửa; giữ nguyên thay đổi hiện có của người dùng.
2. Thực hiện thay đổi nhỏ, đúng phạm vi yêu cầu.
3. Chạy `npm run lint` và `npm run build` khi thay đổi code hoặc cấu hình build.
4. Khi sửa giao diện, kiểm tra kích thước mobile/desktop và các tương tác liên quan.
   Chạy browser tests nếu ảnh hưởng scroll, focus, media loading hoặc form; kiểm tra cả reduced motion.
5. Báo rõ những gì đã đổi, những kiểm tra đã chạy và hạn chế còn lại.

<!-- CODEGRAPH_START -->
## CodeGraph

Nếu thư mục `.codegraph/` tồn tại ở gốc repository, ưu tiên CodeGraph trước
khi tìm kiếm hoặc đọc code để hiểu cấu trúc và luồng gọi:

- Dùng công cụ MCP `codegraph_explore` nếu có; truy vấn tên file hoặc symbol
  để lấy source hiện tại và các đường gọi liên quan.
- Hoặc chạy `codegraph explore "<tên symbol hoặc câu hỏi>"` trong terminal.
- Nếu không có `.codegraph/`, bỏ qua CodeGraph và dùng `rg` / `rg --files`.
  Không tự tạo index; việc indexing do người dùng quyết định.
<!-- CODEGRAPH_END -->
