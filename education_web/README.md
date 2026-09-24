# Learn Forward

Landing page giáo dục bằng React, TypeScript, Tailwind CSS và Vite.

## Chạy và kiểm tra

```bash
npm install
npm run dev
npm run lint
npm run build
npm test
npm run preview
```

Trên PowerShell dùng npm.cmd nếu npm.ps1 bị chặn.

## Nội dung và chuyển động

Trang mở ngay, cuộn tự nhiên. Mục “Learn. Practice. Grow.” dùng ảnh tĩnh và ba bước hiển thị đầy đủ: ba cột trên desktop, một cột trên mobile. Link Continue to community dẫn tới phần cộng đồng.

Đã bỏ ZIP trong assets, video Scroll World, bộ frame, hook tua video và script dựng video từ ZIP. Ảnh tĩnh được giữ tại public/images/learning-desk.webp.

Reveal xuất hiện một lần với opacity và dịch chuyển 8px trong 250ms; hover ảnh phóng nhẹ 1.015 trong 250ms. Hero không có zoom hoặc hiệu ứng theo tiến độ cuộn. Reduced Motion tắt animation, kể cả khi tùy chọn thay đổi trong phiên. Trình duyệt thiếu API animation vẫn hiển thị nội dung.

Copy, ảnh, alt text và CTA nằm trong src/data/content.ts; quy tắc thiết kế ở design-system/MASTER.md.

## Form demo

Chọn learning path điền sẵn Learning goal. Form kiểm tra blur/submit, báo lỗi cạnh trường và focus lỗi đầu tiên. Submit hợp lệ hiển thị kế hoạch mẫu ngay trên trang; không gửi request, lưu dữ liệu hay gửi email.

## Kiểm tra trình duyệt

Sau khi chạy Vite, dùng npm run test:browser (mặc định http://127.0.0.1:5173; đổi qua QA_URL). Script kiểm tra desktop, tablet, mobile 375px và landscape: nội dung đủ ba bước, không tải video/ZIP, không tràn ngang, link cộng đồng, Reduced Motion và chữ phóng lớn trong mục hành trình học. Ảnh và báo cáo ở artifacts/light-motion/. Đây là Chrome giả lập thiết bị.

## Media stock tùy chọn

Ảnh WebP đã có sẵn, không cần FFmpeg để chạy/build. Các lệnh media:fetch và media:build giữ lại pipeline stock cũ để tái tạo ảnh hero và các section; video intro do pipeline cũ tạo ra không được trang sử dụng. Nguồn tạm ở .media-source/ được gitignore.

Ảnh bàn học được giữ từ bộ media người dùng cung cấp. Nguồn stock khác:

- [Panning Shot of College Study Desk](https://mixkit.co/free-stock-video/panning-shot-of-college-study-desk-101309/)
- [A student making notes and mathematical charts](https://mixkit.co/free-stock-video/a-student-making-notes-and-mathematical-charts-on-the-notebook-50109/)
- [Girl working on the floor of a library](https://mixkit.co/free-stock-video/girl-working-on-the-floor-of-a-library-4518/)
- [Girl doing homework in a library](https://mixkit.co/free-stock-video/girl-doing-homework-in-a-library-4531/) (cũng là nguồn ảnh hero)
- [Mixkit license](https://mixkit.co/license/#videoFree)

Ảnh các section được chuyển sang WebP từ ảnh Unsplash có trong dự án: Christopher Gower (laptop), ảnh sách/sổ ghi chép và nhóm học viên. Đường dẫn tải gốc nằm trong `scripts/download-assets.ps1`. Đây là ảnh stock minh họa, không phải testimonial hay học viên của một nền tảng đang hoạt động.

