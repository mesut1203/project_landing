# Nomad Vietnam

Landing page du lịch chậm bằng React, TypeScript và Vite. Thiết kế tạp chí với nền kem, xanh rừng, font Lora lưu tại dự án và phần mở đầu điện ảnh điều khiển bằng cuộn.

## Chạy dự án

```sh
npm install
npm run dev
npm run build
npm test
```

Playwright sử dụng Google Chrome đã cài trên máy. Bộ kiểm tra bao gồm cuộn tiến/lùi, điều hướng chặng, tạm dừng, lỗi media, reduced motion, bộ lọc, form, responsive, zoom 200% và axe WCAG AA.

## Animation từ assets

Nguồn: `src/assets/ezgif-7695b3dad4ebf25e-jpg.zip`, gồm 160 JPEG 1280×720. Giữ nguyên ZIP. Chuỗi được mã hóa thành `public/videos/travel-scroll.mp4` ở độ phân giải gốc, 10 fps, H.264 CRF 20, GOP 8, không âm thanh, faststart (16 giây, khoảng 3.8 MB). Poster là khung hình đầu tại `public/assets/journey/ezgif-frame-001.jpg`.

`src/components/Hero.tsx` áp dụng cơ chế của scroll-world trong React: sticky stage, vị trí cuộn ánh xạ tới thời gian phim, rAF smoothing, chỉ seek tiếp khi decoder đã xong, Blob URL không phụ thuộc HTTP byte ranges, poster khi đang tải/lỗi và priming qua thao tác người dùng cho Safari. Tài nguyên Blob và các listener được giải phóng khi unmount.

Ba chặng nội dung: Khởi hành → Khám phá → Tận hưởng. Nút điều hướng nhảy tới chặng; cuộn lên tua ngược. Nút tạm dừng giữ hình hiện tại, nội dung và điều hướng vẫn hoạt động. Không phát tự động và không lặp phim.

Dùng đúng chuyển cảnh có sẵn trong nguồn, không tạo thêm clip nối bằng AI. Vì nguồn là montage, các điểm cắt có sẵn vẫn được giữ; đây không phải một camera flight mới được render liền mạch. Không phát sinh chi phí tạo media.

Trên điện thoại, giao diện đáp ứng và dùng cùng phim ngang làm nền cover; không có chuỗi portrait 9:16 riêng. Reduced motion chỉ hiển thị poster, không tải phim và rút gọn khoảng cuộn. Chrome desktop/mobile emulation được kiểm tra tự động; Safari iOS thực tế cần kiểm tra trên thiết bị.

## Nội dung và form

Nội dung chính trong `src/data/content.ts`, các chặng điện ảnh trong `src/components/Hero.tsx`, giao diện trong `src/index.css`. Bộ lọc điểm đến liên kết với form tạo ý tưởng. Form chỉ tạo tóm tắt trong React state, không gửi dữ liệu hoặc đặt tour.

## Nguồn media

- Ảnh núi, biển, người lữ hành, chiều tối: ZIP có sẵn trong dự án.
- [Ảnh Hội An trên Unsplash](https://unsplash.com/photos/KpJ1_47WQPc), lưu tại `public/images/hoi-an.webp`; credit có trong footer.
- Font Lora: `@fontsource-variable/lora`, giấy phép OFL-1.1 trong package.

Khi triển khai, phục vụ toàn bộ `dist/` ở gốc domain.

## Vercel

Production: https://nomad-vietnam.vercel.app

Project: `nomad-vietnam`, thuộc team `caubevang2004-4680s-projects`.
Vercel dùng `npm run build` và phục vụ thư mục `dist` theo `vercel.json`.

Deploy các thay đổi tiếp theo từ thư mục dự án:

```sh
npx vercel deploy --prod --scope caubevang2004-4680s-projects
```
