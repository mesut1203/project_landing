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
  videos/              # Intro desktop và portrait
src/
  assets/              # ZIP nguồn gốc, giữ nguyên
  components/          # Các section, intro, menu và story
  data/content.ts      # Copy, CTA, đường dẫn media và cấu hình scene
  hooks/               # Media query và video scrub
  types/content.ts     # Interfaces cho dữ liệu
  App.tsx
  main.tsx
  index.css
scripts/               # Dựng media và kiểm tra hình ảnh
tests/site.spec.ts     # Kiểm tra hành vi, responsive và accessibility
vite.config.ts
```

Tailwind được tích hợp qua plugin `@tailwindcss/vite` và dòng `@import "tailwindcss";` trong `src/index.css`, theo [hướng dẫn chính thức](https://tailwindcss.com/docs/installation/using-vite).

## Intro và scroll story

- Intro desktop: `public/videos/real-estate-intro.mp4`, gần 14 giây, được dựng từ 140 frame trong ZIP người dùng cung cấp.
- Intro mobile: `public/videos/real-estate-intro-portrait.mp4`, 14 giây, là chuỗi ảnh portrait riêng chuyển mờ, không phải crop phim desktop.
- Video autoplay, muted, playsInline, không loop. Hết phim hoặc chọn `Skip intro` sẽ fade trong 700 ms.
- Lỗi, autoplay bị chặn hoặc chờ quá 4 giây sẽ mở nội dung cùng poster. Chế độ reduced motion không tải video.
- Desktop: Motion theo dõi native scroll và tua video Blob bằng `currentTime`. Các lệnh seek được gộp khi decoder đang bận; object URL, listener và request được dọn khi unmount.
- Story cho phép tải video nền tối đa 25 giây trên mạng thực tế; poster và nội dung luôn hiện sẵn. Intro vẫn bỏ qua khi chờ quá 4 giây.
- Mobile: chuỗi bốn ảnh portrait dùng opacity/transform theo scroll, không tải phim landscape. Ảnh bổ sung được tải sau intro để ưu tiên poster đầu tiên.
- Reduced motion: bốn scene hiện thành các bài giới thiệu tĩnh, không pin hoặc zoom.
- `Skip story`, liên kết navbar và CTA sử dụng anchor thông thường. Không chặn wheel hoặc touch để điều khiển trang.

## Nội dung và media

Sửa nội dung, CTA, media và mốc scene trong `src/data/content.ts`. Vite lấy cả metadata HTML và preload poster từ file này.

Ảnh portrait và ảnh tiện ích được tạo mới để minh họa concept; chúng không phải ảnh chụp xác thực của một dự án đang bán. Bản demo có ghi chú rõ ở footer. Xem `MEDIA.md` để biết nguồn và cách dựng lại phim.

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

Bộ kiểm tra bao gồm intro/autoplay/fade, tua tiến và lùi, lỗi video, timeout, thay đổi reduced motion, menu bàn phím và focus, tách media theo thiết bị, form demo, axe accessibility và overflow ở 320–1920 px.

Kiểm tra ảnh bổ sung: chạy preview trên cổng 4173 rồi `node scripts/visual-qa.mjs`. Ảnh các section và điểm chuyển scene được lưu trong `tmp/`. Script còn kiểm tra điện thoại portrait/landscape và mô phỏng CPU chậm 4 lần. Đây là giả lập Chrome; chưa thay thế việc kiểm tra Safari trên iPhone thật.

Tham khảo: [Motion useScroll](https://motion.dev/docs/react-use-scroll), [HTML dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog), [Playwright emulation](https://playwright.dev/docs/emulation).

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
