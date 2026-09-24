# Luma Residences

Landing page bất động sản sử dụng React, TypeScript, Vite và Tailwind CSS v4. Giao diện charcoal, ivory, champagne gold và forest green; font Cormorant Garamond và Manrope được phục vụ cục bộ.

## Chạy dự án

```bash
npm install
npm run dev
```

Mở địa chỉ được Vite in ra trong terminal (mặc định là http://localhost:5173).

## Build và xem bản build

```bash
npm run build
npm run preview
```

Bản build nằm trong thư mục `dist/`.

## Cấu trúc

```text
public/
  images/desktop/      # Chỉ được tải trên desktop
  images/mobile/       # Ảnh portrait riêng
  videos/              # Video đã dựng trước đây, không được giao diện tải
src/
  assets/              # Tài nguyên import (ZIP đã được xóa)
  components/          # Các section, menu và reveal nhẹ
  data/content.ts      # Copy, CTA và đường dẫn ảnh
  hooks/               # Media query
  types/content.ts     # Interfaces cho dữ liệu
  App.tsx
  main.tsx
  index.css
scripts/               # Kiểm tra hình ảnh
tests/site.spec.ts     # Kiểm tra hành vi, responsive và accessibility
vite.config.ts
```

Tailwind được tích hợp qua plugin `@tailwindcss/vite` và dòng `@import "tailwindcss";` trong `src/index.css`, theo [hướng dẫn chính thức](https://tailwindcss.com/docs/installation/using-vite).

## Cuộn tự nhiên và animation nhẹ

- Nội dung hiện ngay khi mở trang. Bốn phần giới thiệu dùng ảnh tĩnh và cuộn tự nhiên, không ghim màn hình, tua video hoặc intro tự chạy.
- Reveal dùng `IntersectionObserver` và Web Animations API: fade từ 0.75 đến 1, dịch 6 px trong 250 ms, chạy một lần khi nội dung xuất hiện.
- Hover ảnh căn hộ phóng nhẹ 1.015× trong 250 ms. Nút và liên kết có phản hồi 200–220 ms.
- Reduced motion tắt reveal và chuyển động tương tác; thay đổi tùy chọn trong lúc xem cũng được áp dụng.
- Mobile chỉ tải ảnh portrait, desktop dùng ảnh landscape. Ảnh đầu được preload, các ảnh dưới dùng lazy loading.
- `Explore residences`, navbar và CTA sử dụng anchor thông thường.
- ZIP nguồn và các script dựng phim đã được gỡ. Giao diện không còn phụ thuộc `motion`, `adm-zip` hoặc FFmpeg.

## Nội dung và media

Sửa nội dung, CTA và ảnh trong `src/data/content.ts`. Vite lấy metadata HTML và preload ảnh đầu từ file này.

Ảnh portrait và ảnh tiện ích được tạo mới để minh họa concept; chúng không phải ảnh chụp xác thực của một dự án đang bán. Bản demo có ghi chú rõ ở footer. Xem `MEDIA.md` để biết nguồn tài nguyên.

## Form demo

Form có Name, Email, Preferred viewing date, kiểm tra dữ liệu bắt buộc, định dạng email và ngày không nằm trong quá khứ. Form không gửi request, không lưu thông tin cá nhân và không xác nhận một lịch hẹn thực tế.

Thông báo được hiển thị nguyên văn:

> Demo form. Connect a CRM or booking service to receive submissions.

Khi có backend, tích hợp tại handler trong `src/components/ViewingForm.tsx` và cập nhật các thông báo liên quan trong file content.

## Kiểm tra

```bash
npm run typecheck
npm run build
npm run test
```

Playwright dùng Chrome đã cài trên máy (`channel: 'chrome'`) và tự chạy Vite tại cổng 4173 nếu chưa có server. Nếu dùng preview đang chạy, build lại trước khi kiểm tra.

Bộ kiểm tra bao gồm nội dung hiện ngay, cuộn tự nhiên, không tải video, thay đổi reduced motion, menu bàn phím và focus, tách ảnh theo thiết bị, form demo, axe accessibility và overflow ở 320–1920 px.

Kiểm tra ảnh bổ sung: chạy preview trên cổng 4173 rồi `node scripts/visual-qa.mjs`. Ảnh các section và bảng so sánh hero được lưu trong `tmp/`. Script kiểm tra điện thoại dọc/ngang, CPU chậm 4 lần và cỡ chữ gốc 200%. Đây là giả lập Chrome; chưa thay thế việc kiểm tra Safari trên iPhone thật.

Tham khảo: [HTML dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog), [Playwright emulation](https://playwright.dev/docs/emulation).

## Triển khai Vercel

Production: [luma-residences.vercel.app](https://luma-residences.vercel.app). Project: `luma-residences`.

`vercel.json` cấu hình Vite, Node.js 24 (qua `package.json`), `npm ci`, `npm run build` và thư mục output `dist`. `.vercelignore` loại thư mục tạm, bài kiểm tra và ZIP nguồn khỏi gói upload; các ảnh và video đã tối ưu trong `public/` được giữ lại.

Lockfile đã bổ sung dependency đi kèm Tailwind cho môi trường Linux bằng npm 11 mới nhất. Khi cập nhật thư viện từ Windows, giữ đầy đủ optional/bundled dependencies để `npm ci` trên Vercel tiếp tục hoạt động.

```bash
npx vercel login
npx vercel --prod
```

Lần đầu chọn tài khoản/team và liên kết hoặc tạo project. Những lần sau CLI dùng thông tin trong `.vercel/` (được loại khỏi Git). Trang dùng anchor nội bộ, không cần rewrite cho router. Form demo vẫn không có backend sau khi deploy.

Tham khảo: [Vite trên Vercel](https://vercel.com/docs/frameworks/frontend/vite).
