# Nomad Vietnam

Landing page du lịch chậm bằng React, TypeScript và Vite. Thiết kế nhật ký du lịch giàu chất điện ảnh: phong cảnh mở toàn màn hình, headline lớn, nền giấy ấm và bố cục phân cấp rõ giữa hành trình nổi bật với các gợi ý tiếp theo. Font Lora/Manrope được lưu tại dự án.

## Chạy dự án

```sh
npm install
npm run dev
npm run build
npm test
```

Playwright sử dụng Chromium. Chạy `npx playwright install chromium` nếu trình duyệt chưa có trên máy. Kiểm tra cuộn tự nhiên, không tải video, reduced motion, bộ lọc, form, responsive, zoom 200% và axe WCAG AA.

## Hình ảnh và chuyển động

Hero dùng ảnh mới tại `public/images/ha-giang-dawn.webp`. Toàn bộ ảnh gốc đã được thay bằng bộ ảnh WebP tạo riêng cho dự án.

Trang cuộn tự nhiên, không ghim hero hoặc cưỡng ép hướng cuộn. Ảnh hero mở nhẹ trong 2,4 giây; headline xuất hiện theo từng phần và phong cảnh có parallax nhẹ trên desktop. Nội dung bên dưới hiện một lần với opacity/translateY tối đa 28px trong 900ms. Bố cục dùng container query để giữ khả năng đọc khi phóng to trang; hero tăng chiều cao theo nội dung trên mobile. Nhãn hành trình dùng React Bits DecryptedText; câu trích dẫn dùng React Bits ScrollReveal với GSAP ScrollTrigger. Hiệu ứng chữ chỉ dùng opacity và transform, không dùng blur. Tôn trọng prefers-reduced-motion kể cả khi thay đổi tùy chọn khi trang đang mở; nội dung cho trình đọc màn hình luôn là câu hoàn chỉnh.

## React Bits

Hai component trong `src/components/react-bits/` được lấy từ [DavidHDev/react-bits](https://github.com/DavidHDev/react-bits), bản TypeScript/CSS tại commit `b6666e9f3a03a062143ce409f3aac53e27fdfaa8`:

- [DecryptedText](https://github.com/DavidHDev/react-bits/blob/b6666e9f3a03a062143ce409f3aac53e27fdfaa8/src/ts-default/TextAnimations/DecryptedText/DecryptedText.tsx): bổ sung reduced motion và giữ nguyên văn bản cho trình đọc màn hình.
- [ScrollReveal](https://github.com/DavidHDev/react-bits/blob/b6666e9f3a03a062143ce409f3aac53e27fdfaa8/src/ts-default/TextAnimations/ScrollReveal/ScrollReveal.tsx): dùng paragraph ngữ nghĩa, bỏ blur, cô lập cleanup bằng GSAP context/matchMedia và tôn trọng reduced motion.

Giữ nguyên giấy phép MIT + Commons Clause của David Haz trong `src/components/react-bits/LICENSE.md`. Component được tích hợp vào website, không phân phối thành thư viện riêng. `gsap` và `motion` là dependency runtime.

## Nội dung và form

Nội dung trong `src/data/content.ts`, giao diện nền trong `src/index.css` và art direction trong `src/redesign.css`. Menu mobile dùng dialog có focus loop, Escape và trả focus về nút mở. Bộ lọc điểm đến liên kết với form tạo ý tưởng. Form chỉ tạo tóm tắt trong React state, không gửi dữ liệu hoặc đặt tour.

## Nguồn media

- Bộ tám ảnh riêng cho tám vị trí, không lặp ảnh giữa các mục: sông giữa núi Hà Giang (`ha-giang-dawn.webp`), vịnh biển (`vinh-hy-cove.webp`), phố Hội An buổi sáng (`hoi-an-morning.webp`), người lữ hành giữa ruộng bậc thang (`terrace-walk.webp`), cung đường núi (`mountain-pass.webp`), đường ven biển (`coastal-road.webp`), bờ sông Hội An lên đèn (`hoi-an-riverside.webp`) và thung lũng đồi chè (`quiet-horizon.webp`). Đây là hình ảnh minh họa tạo bằng AI, không phải cam kết cảnh quan của một tour.
- Font Lora: `@fontsource-variable/lora`, giấy phép OFL-1.1 trong package.

Khi triển khai, phục vụ toàn bộ `dist/` ở gốc domain.

## Vercel

Production: https://nomad-vietnam.vercel.app

Project: `nomad-vietnam`, thuộc team `caubevang2004-4680s-projects`.
Vercel dùng `npm run build` và phục vụ thư mục `dist` theo `vercel.json`.

```sh
npx vercel deploy --prod --scope caubevang2004-4680s-projects
```
