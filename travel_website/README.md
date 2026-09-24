# Nomad Vietnam

Landing page du lịch chậm bằng React, TypeScript và Vite. Thiết kế tạp chí với nền kem, xanh rừng, font Lora lưu tại dự án và hero ảnh tĩnh.

## Chạy dự án

```sh
npm install
npm run dev
npm run build
npm test
```

Playwright sử dụng Google Chrome đã cài trên máy. Kiểm tra cuộn tự nhiên, không tải video, reduced motion, bộ lọc, form, responsive, zoom 200% và axe WCAG AA.

## Hình ảnh và chuyển động

Hero dùng ảnh tĩnh tại `public/assets/journey/ezgif-frame-001.jpg`. ZIP nguồn và video nền đã được xóa. Ảnh tĩnh đã trích xuất được giữ để hiển thị nội dung.

Trang cuộn tự nhiên, không ghim hero, không tua video và không phóng/thu các section theo cuộn. Nội dung hiện nhẹ một lần với opacity/translateY tối đa 8px trong 280ms; hover 180–280ms. Tôn trọng prefers-reduced-motion, hiển thị nội dung ngay khi điều hướng bằng bàn phím.

## Nội dung và form

Nội dung trong `src/data/content.ts`, giao diện trong `src/index.css`. Bộ lọc điểm đến liên kết với form tạo ý tưởng. Form chỉ tạo tóm tắt trong React state, không gửi dữ liệu hoặc đặt tour.

## Nguồn media

- Ảnh núi, biển, người lữ hành, chiều tối: ảnh đã trích xuất từ tư liệu gốc của dự án.
- [Ảnh Hội An trên Unsplash](https://unsplash.com/photos/KpJ1_47WQPc), lưu tại `public/images/hoi-an.webp`; credit có trong footer.
- Font Lora: `@fontsource-variable/lora`, giấy phép OFL-1.1 trong package.

Khi triển khai, phục vụ toàn bộ `dist/` ở gốc domain.

## Vercel

Production: https://nomad-vietnam.vercel.app

Project: `nomad-vietnam`, thuộc team `caubevang2004-4680s-projects`.
Vercel dùng `npm run build` và phục vụ thư mục `dist` theo `vercel.json`.

```sh
npx vercel deploy --prod --scope caubevang2004-4680s-projects
```
