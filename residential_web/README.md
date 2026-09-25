# Luma Residences

Landing page bất động sản sử dụng React, TypeScript, Vite và Tailwind CSS v4. Giao diện folio kiến trúc đơn sắc: nền limestone/ivory, chữ carbon Manrope, nét kẻ Swiss, tiêu đề ngang trên ảnh mặt đứng toàn cảnh, ba nghiên cứu không gian trong một lưới bất đối xứng và các hàng căn hộ có đánh số. Font được phục vụ cục bộ.

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
  images/mobile/       # Phiên bản tối ưu cho mobile
src/
  assets/              # Tài nguyên import (ZIP đã được xóa)
  components/          # Các section, menu và reveal nhẹ
  data/content.ts      # Copy, CTA và đường dẫn ảnh
  hooks/               # Media query
  types/content.ts     # Interfaces cho dữ liệu
  App.tsx
  main.tsx
  index.css
  redesign.css         # Gallery kiến trúc và responsive hiện tại
scripts/               # Kiểm tra hình ảnh
tests/site.spec.ts     # Kiểm tra hành vi, responsive và accessibility
vite.config.ts
```

Tailwind được tích hợp qua plugin `@tailwindcss/vite` và dòng `@import "tailwindcss";` trong `src/index.css`, theo [hướng dẫn chính thức](https://tailwindcss.com/docs/installation/using-vite).

## Cuộn tự nhiên và animation nhẹ

- Nội dung hiện ngay khi mở trang. Bốn phần giới thiệu dùng ảnh tĩnh và cuộn tự nhiên, không ghim màn hình, tua video hoặc intro tự chạy.
- Các phần nội dung dùng `IntersectionObserver` và Web Animations API: dịch 28 px trong 900 ms, giữ nguyên độ đậm của chữ và form trong suốt chuyển động, chạy một lần khi nội dung xuất hiện.
- Hover ảnh căn hộ phóng nhẹ 1.015× trong 250 ms. Nút và liên kết có phản hồi 200–220 ms.
- ReactBits `SplitText` tách tiêu đề hero theo từ và xuất hiện một lần. Component được lấy từ [nguồn chính thức](https://github.com/DavidHDev/react-bits/blob/b6666e9f3a03a062143ce409f3aac53e27fdfaa8/src/ts-default/TextAnimations/SplitText/SplitText.tsx), điều chỉnh cho semantic heading, desktop và reduced motion. License MIT + Commons Clause nằm tại `public/licenses/react-bits-LICENSE.md`.
- GSAP `ScrollTrigger` tạo chuyển động ảnh rất nhẹ bên trong khung hero và kiến trúc. Khung ảnh vẫn cuộn tự nhiên, không pin hoặc chặn thao tác cuộn.
- Cả SplitText và chuyển động ảnh dùng `gsap.matchMedia`: tắt dưới 768px hoặc khi người dùng chọn reduced motion; cleanup khôi phục nội dung và transform khi tùy chọn thay đổi.
- Reduced motion cũng tắt reveal và chuyển động tương tác; thay đổi tùy chọn trong lúc xem được áp dụng ngay.
- Mobile chỉ tải phiên bản ảnh tối ưu cho màn hình nhỏ; desktop dùng ảnh landscape 1536 px. Ảnh đầu được preload, các ảnh dưới dùng lazy loading.
- `Explore residences`, navbar và CTA sử dụng anchor thông thường.
- ZIP nguồn và các script dựng phim đã được gỡ. Giao diện không còn phụ thuộc `motion`, `adm-zip` hoặc FFmpeg.

## Nội dung và media

Sửa nội dung, CTA và ảnh trong `src/data/content.ts`. Vite lấy metadata HTML và preload ảnh đầu từ file này.

Bộ ảnh gồm 12 cảnh riêng biệt, mỗi cảnh có phiên bản WebP desktop và mobile; không lặp ảnh giữa các vị trí trên trang:

- Hero và nghiên cứu không gian: `luma-exterior`, `luma-courtyard`, `luma-living`, `luma-terrace`.
- Căn hộ: `luma-one-bedroom`, `luma-two-bedroom`, `luma-three-bedroom`.
- Vật liệu kiến trúc: `luma-materials`.
- Tiện ích: `luma-rooftop`, `luma-wellness`, `luma-garden`, `luma-lounge`.

Ảnh được tạo mới để minh họa concept; chúng không phải ảnh chụp xác thực của một dự án đang bán. Bản demo có ghi chú rõ ở footer. Xem `MEDIA.md` để biết nguồn tài nguyên.

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

Playwright dùng Chromium mặc định và tự chạy Vite tại cổng 4173 nếu chưa có server. Biến `PLAYWRIGHT_CHANNEL` cho phép chọn channel khác. Nếu dùng preview đang chạy, build lại trước khi kiểm tra.

Bộ kiểm tra bao gồm nội dung hiện ngay, cuộn tự nhiên, không tải video, thay đổi reduced motion, menu bàn phím và focus, tách ảnh theo thiết bị, form demo, axe accessibility và overflow ở 320–1920 px.

Kiểm tra ảnh bổ sung: chạy preview trên cổng 4173 rồi `node scripts/visual-qa.mjs`. Ảnh các section và bảng so sánh hero được lưu trong `tmp/`. Script kiểm tra điện thoại dọc/ngang, CPU chậm 4 lần và cỡ chữ gốc 200%. Đây là giả lập Chrome; chưa thay thế việc kiểm tra Safari trên iPhone thật.

Tham khảo: [HTML dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog), [Playwright emulation](https://playwright.dev/docs/emulation).

## Triển khai Vercel

Production: [luma-residences.vercel.app](https://luma-residences.vercel.app). Project: `luma-residences`.

`vercel.json` cấu hình Vite, Node.js 24 (qua `package.json`), `npm ci`, `npm run build` và thư mục output `dist`. `.vercelignore` loại thư mục tạm, bài kiểm tra và ZIP nguồn khỏi gói upload; các ảnh WebP trong `public/` được giữ lại.

Lockfile đã bổ sung dependency đi kèm Tailwind cho môi trường Linux bằng npm 11 mới nhất. Khi cập nhật thư viện từ Windows, giữ đầy đủ optional/bundled dependencies để `npm ci` trên Vercel tiếp tục hoạt động.

```bash
npx vercel login
npx vercel --prod
```

Lần đầu chọn tài khoản/team và liên kết hoặc tạo project. Những lần sau CLI dùng thông tin trong `.vercel/` (được loại khỏi Git). Trang dùng anchor nội bộ, không cần rewrite cho router. Form demo vẫn không có backend sau khi deploy.

Tham khảo: [Vite trên Vercel](https://vercel.com/docs/frameworks/frontend/vite).
