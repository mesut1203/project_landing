# Hướng dẫn làm việc — Cafe Shop

## Phạm vi và giao tiếp

- Áp dụng cho toàn bộ dự án `cafe_shop`.
- Trao đổi và báo cáo kết quả bằng tiếng Việt, trừ khi người dùng yêu cầu khác.
- Thực hiện đúng yêu cầu hiện tại; giữ nguyên các thay đổi có sẵn của người dùng.
- Đọc phần mã liên quan trước khi sửa. Giữ thay đổi tập trung vào nhiệm vụ.

## Công nghệ

- React với TypeScript, Vite và ES Modules.
- TypeScript bật `strict`; cấu hình ứng dụng trong `tsconfig.app.json`, cấu hình Vite trong `tsconfig.node.json`.
- CSS thuần và Oxlint. Phiên bản thư viện được khai báo trong `package.json` và khóa trong `package-lock.json`.
- Dùng npm để quản lý thư viện. Các lệnh bên dưới dùng `npm.cmd` cho PowerShell trên Windows; trên macOS/Linux dùng `npm`.

## Cấu trúc hiện tại

- `src/main.tsx`: điểm khởi chạy React.
- `src/App.tsx`: component ứng dụng chính.
- `src/App.css`: CSS của ứng dụng.
- `src/index.css`: CSS toàn cục.
- `src/assets/`: tài nguyên được import từ mã nguồn.
- `public/`: tài nguyên tĩnh được truy cập trực tiếp bằng đường dẫn URL.
- `index.html`: trang HTML đầu vào của Vite.
- `vite.config.ts`: cấu hình Vite.
- `.oxlintrc.json`: cấu hình lint.
- `dist/`: kết quả build tự sinh; sửa mã nguồn thay vì chỉnh trực tiếp thư mục này.

## Lệnh làm việc

| Lệnh | Mục đích |
| --- | --- |
| `npm.cmd ci` | Cài thư viện theo lockfile khi thiết lập lại môi trường |
| `npm.cmd run dev` | Chạy máy chủ phát triển; dùng địa chỉ được in trong terminal |
| `npm.cmd run typecheck` | Kiểm tra TypeScript bằng `tsc -b` |
| `npm.cmd run lint` | Kiểm tra mã bằng Oxlint |
| `npm.cmd run build` | Kiểm tra TypeScript rồi build vào `dist/` |
| `npm.cmd run preview` | Xem bản production sau khi build |

## Quy ước mã nguồn

- Dùng `.tsx` cho component có JSX và `.ts` cho logic hoặc kiểu dữ liệu.
- Dùng function component và React Hooks; tên component theo PascalCase, tên hook bắt đầu bằng `use`.
- Khai báo kiểu cho props và dữ liệu dùng chung; tận dụng suy luận kiểu khi đã rõ ràng.
- Dùng `import type` cho import chỉ phục vụ kiểu dữ liệu.
- Tránh `any`, `@ts-ignore` và ép kiểu để che lỗi. Sửa nguyên nhân hoặc kiểm tra dữ liệu trước khi sử dụng.
- Giữ chế độ `strict` và các kiểm tra hiện có; không tắt chúng chỉ để build thành công.
- Theo phong cách mã hiện tại: thụt lề 2 khoảng trắng, chuỗi JavaScript dùng dấu nháy đơn, không thêm dấu chấm phẩy không cần thiết.
- Tái sử dụng component, CSS và tài nguyên có sẵn. Tách component hoặc hook khi giúp mã dễ đọc hoặc tái sử dụng.
- Chỉ thêm thư viện khi nhiệm vụ cần đến; khi thêm hoặc cập nhật, dùng npm để cập nhật cả `package.json` và `package-lock.json`.
- Giữ giao diện thích ứng với kích thước màn hình; dùng HTML đúng ngữ nghĩa, nhãn biểu mẫu, văn bản thay thế phù hợp và trạng thái focus dễ thấy.

## Kiểm tra trước khi bàn giao

- Khi sửa mã hoặc cấu hình, chạy `npm.cmd run lint` và `npm.cmd run build`. Build đã bao gồm kiểm tra TypeScript.
- Khi chỉ cần kiểm tra kiểu trong quá trình phát triển, dùng `npm.cmd run typecheck`.
- Khi thay đổi giao diện hoặc tương tác, kiểm tra phần bị ảnh hưởng trong trình duyệt trên kích thước desktop và mobile nếu công cụ có sẵn.
- Dự án hiện chưa có script `test`. Không báo đã chạy kiểm thử tự động nếu chưa có và chưa chạy công cụ tương ứng.
- Thay đổi chỉ liên quan tài liệu không cần chạy lại build; kiểm tra nội dung, đường dẫn và lệnh được ghi trong tài liệu.
- Khi bàn giao, nêu ngắn gọn phần đã sửa, kiểm tra đã chạy và hạn chế còn tồn tại nếu có.

<!-- CODEGRAPH_START -->
## CodeGraph

In repositories indexed by CodeGraph (a `.codegraph/` directory exists at the repo root), reach for it BEFORE grep/find or reading files when you need to understand or locate code:

- **MCP tool** (when available): `codegraph_explore` answers most code questions in one call — the relevant symbols' verbatim source plus the call paths between them, including dynamic-dispatch hops grep can't follow. Name a file or symbol in the query to read its current line-numbered source. If it's listed but deferred, load it by name via tool search.
- **Shell** (always works): `codegraph explore "<symbol names or question>"` prints the same output.

If there is no `.codegraph/` directory, skip CodeGraph entirely — indexing is the user's decision.
<!-- CODEGRAPH_END -->

Khi không có `.codegraph/`, ưu tiên `rg` và `rg --files` để tìm mã; bỏ qua `node_modules/` và `dist/` khi tìm trong mã nguồn.
