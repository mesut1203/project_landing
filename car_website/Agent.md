# Hướng dẫn làm việc với dự án

## Tổng quan

- Dự án: `car_website`.
- Công nghệ hiện tại: React 19, TypeScript (TSX), Vite 8, Tailwind CSS 4 và Oxlint.
- Quản lý gói bằng npm; giữ `package-lock.json` đồng bộ khi thay đổi dependencies.
- Trao đổi và viết nội dung hướng dẫn bằng tiếng Việt, trừ khi có yêu cầu khác.

## Cấu trúc chính

| Đường dẫn | Vai trò |
| --- | --- |
| `src/main.tsx` | Khởi tạo React, nạp font và CSS toàn cục |
| `src/App.tsx` | Component trang chính |
| `src/data/content.ts` | Copy, CTA và đường dẫn ảnh tĩnh |
| `src/components/` | Navbar, menu, hero và các section landing |
| `src/index.css` | Nhập Tailwind CSS và khai báo CSS toàn cục |
| `src/assets/` | Tài nguyên được import trong mã nguồn |
| `public/` | Tài nguyên tĩnh được phục vụ trực tiếp |
| `index.html` | HTML đầu vào, ngôn ngữ và metadata |
| `vite.config.js` | Cấu hình plugin React và Tailwind CSS |
| `.oxlintrc.json` | Quy tắc kiểm tra mã nguồn |

## Lệnh thường dùng

```sh
npm install
npm run dev
npm run lint
npm run build
npm run preview
npm run test
```

- `dev`: chạy môi trường phát triển; mở địa chỉ được in trong terminal.
- `lint`: kiểm tra mã nguồn bằng Oxlint.
- `build`: tạo bản production trong `dist/`.
- `preview`: xem thử bản production sau khi build.
- `test`: chạy Playwright với Chrome; kiểm tra responsive, landing tĩnh, menu và accessibility.
- Trên PowerShell, dùng `npm.cmd` nếu `npm.ps1` bị chặn bởi execution policy.

## Quy ước triển khai

- Đọc mã liên quan trước khi sửa; giữ thay đổi tập trung vào yêu cầu hiện tại.
- Giữ TypeScript strict, ES modules, function components và React Hooks theo cấu trúc hiện có.
- Dùng thụt lề 2 dấu cách, dấu nháy đơn trong JavaScript và phong cách không dùng dấu chấm phẩy hiện tại.
- Tách component khi có phần giao diện được tái sử dụng hoặc khi component trở nên khó đọc.
- Ưu tiên các utility class của Tailwind; CSS toàn cục đặt trong `src/index.css` khi cần.
- Tailwind hiện được tích hợp qua `@tailwindcss/vite` và `@import "tailwindcss";`; giữ cấu hình này khi mở rộng giao diện.
- Dùng HTML có ngữ nghĩa, nhãn cho ô nhập liệu, văn bản thay thế phù hợp cho ảnh và trạng thái focus rõ ràng.
- Khi thay đổi giao diện, kiểm tra khả năng sử dụng trên màn hình nhỏ và lớn.
- Tận dụng các gói đã cài; chỉ thêm dependency khi có nhu cầu cụ thể.
- Không sửa trực tiếp `node_modules/`, `dist/` hoặc đưa khóa bí mật vào mã nguồn.
- Giữ nguyên những thay đổi của người dùng không liên quan đến công việc đang thực hiện.

<!-- CODEGRAPH_START -->
## CodeGraph

- Nếu thư mục `.codegraph/` tồn tại ở gốc dự án, dùng CodeGraph trước khi tìm kiếm hoặc đọc mã để hiểu hay xác định vị trí code.
- Ưu tiên công cụ MCP `codegraph_explore` khi có; nêu tên file, symbol hoặc câu hỏi cần tìm hiểu.
- Có thể dùng lệnh `codegraph explore "<symbol names or question>"` trong terminal.
- Nếu không có `.codegraph/`, bỏ qua CodeGraph; không tự khởi tạo chỉ mục.
- Khi không dùng CodeGraph, ưu tiên `rg` và `rg --files` để tìm kiếm.
<!-- CODEGRAPH_END -->

## Kiểm tra và bàn giao

- Sau khi thay đổi mã nguồn hoặc cấu hình build, chạy `npm run lint` và `npm run build`.
- Với thay đổi giao diện hoặc tương tác, kiểm tra thêm trong trình duyệt khi có thể.
- Khi thay đổi hero, menu hoặc responsive, chạy các bài Playwright liên quan trong `tests/`.
- Ảnh nguồn hiện có watermark và thay đổi mẫu xe; xem `docs/MEDIA.md` trước khi thay media.
- Với thay đổi chỉ liên quan đến tài liệu, kiểm tra nội dung và đường dẫn được nhắc đến.
- Khi hoàn thành, báo ngắn gọn phần đã sửa, kết quả kiểm tra và những điểm chưa xác minh được.
