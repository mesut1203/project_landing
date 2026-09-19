# Hướng dẫn làm việc với Residential Web

## Tổng quan

- Dự án frontend Luma Residences sử dụng React, TypeScript/TSX và Vite.
- Giao diện sử dụng Tailwind CSS v4, tích hợp qua `@tailwindcss/vite`.
- Quản lý thư viện bằng npm.

## Cấu trúc thư mục

```text
public/             Tài nguyên tĩnh được phục vụ trực tiếp
src/
  assets/           Hình ảnh, font và tài nguyên import trong mã nguồn
  components/       Component dùng lại
  data/content.ts   Toàn bộ copy, CTA, media paths và scene config
  hooks/            Media query và video scrub
  types/            TypeScript interfaces
  App.tsx           Component gốc
  main.tsx          Điểm khởi chạy React
  index.css         Import Tailwind và CSS toàn cục
index.html          HTML đầu vào
vite.config.ts      Cấu hình Vite, React và Tailwind
```

## Lệnh sử dụng

```bash
npm install         # Cài thư viện theo package.json
npm run dev         # Chạy môi trường phát triển
npm run build       # Tạo bản build trong dist/
npm run preview     # Xem bản build sau khi build thành công
```

## Quy ước phát triển

- Sử dụng functional component và React Hooks.
- Đặt tên file component theo PascalCase, ví dụ `Navbar.tsx`.
- Đặt component trong `src/components`; giữ nội dung và cấu hình media trong `src/data/content.ts`.
- Tôn trọng reduced motion, native scrolling và việc chỉ tải đúng asset portrait/landscape theo thiết bị.
- Không thêm số liệu, giá bán, rating, testimonial hoặc lời xác nhận đặt lịch giả.
- Sử dụng ES modules với `import` và `export`.
- Giữ phong cách mã hiện tại: thụt lề 2 khoảng trắng, chuỗi JavaScript dùng nháy đơn, không dùng dấu chấm phẩy.
- Ưu tiên utility class của Tailwind trong `className`; đặt CSS toàn cục trong `src/index.css`.
- Giữ dòng `@import "tailwindcss";` và plugin Tailwind trong cấu hình Vite.
- Thiết kế responsive, sử dụng HTML đúng ngữ nghĩa, bổ sung nhãn cho input và mô tả phù hợp cho hình ảnh.
- Giữ các tài nguyên hiện có; chỉ thay đổi hoặc xóa khi thuộc phạm vi công việc.
- Không chỉnh sửa trực tiếp `node_modules/` hoặc `dist/`.
- Không đưa khóa API, mật khẩu hoặc thông tin bí mật vào mã frontend.
- Khi thay đổi thư viện, cập nhật cả `package.json` và `package-lock.json` thông qua npm.

## Tìm hiểu mã nguồn

- Nếu thư mục gốc có `.codegraph/`, ưu tiên CodeGraph trước khi tìm kiếm hoặc đọc mã để hiểu cấu trúc và luồng gọi.
- Sử dụng công cụ `codegraph_explore` nếu có, hoặc lệnh `codegraph explore "<tên symbol hoặc câu hỏi>"`.
- Nếu không có `.codegraph/`, bỏ qua CodeGraph; không tự tạo chỉ mục.
- Ưu tiên `rg` và `rg --files` cho tìm kiếm thông thường khi không dùng CodeGraph.

## Kiểm tra trước khi hoàn tất

- Chạy `npm run build` sau khi thay đổi mã nguồn hoặc cấu hình build.
- Khi thay đổi giao diện, kiểm tra trên kích thước màn hình máy tính và điện thoại.
- Khi thay đổi tương tác, kiểm tra trực tiếp hành vi liên quan.
- Chạy `npm run test` cho thay đổi tương tác/media/accessibility. Dự án có Playwright và axe; chưa có script lint.
- Báo ngắn gọn các thay đổi, kết quả kiểm tra và vấn đề còn tồn tại nếu có.
