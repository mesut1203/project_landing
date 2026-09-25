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

Trang mở ngay, cuộn tự nhiên. Mục “Learn. Practice. Grow.” dùng ảnh tĩnh và ba bước hiển thị đầy đủ: ảnh bên cạnh danh sách trên desktop, một cột trên mobile. Link Continue to community dẫn tới phần cộng đồng.

Đã bỏ ZIP trong assets, video Scroll World, bộ frame, hook tua video và script dựng video từ ZIP. Ảnh tĩnh mới được tạo cho dự án và lưu tại public/images/.

Hero có chữ chạy lên qua khung cắt, màn cobalt mở ảnh chân dung và CTA xuất hiện theo nhịp. Thanh vàng mở ngang, chỉ mục khóa học hiện lần lượt cùng đường kẻ, các bước học hiện từ trái sang phải. Web Animations API và IntersectionObserver chạy các chuỗi hữu hạn, chỉ thay đổi transform/opacity; không khóa hoặc điều khiển cuộn. Hover/focus nhấn mạnh khóa học và hướng mũi tên. Reduced Motion hủy ngay hiệu ứng đang chạy khi đổi tùy chọn, trả nội dung về trạng thái đầy đủ. Focus bàn phím cũng kết thúc hiệu ứng ở phần đang tương tác. Trình duyệt thiếu API animation vẫn hiển thị nội dung.

Copy, ảnh, alt text và CTA nằm trong src/data/content.ts. Hệ thống giao diện viện học tập màu cobalt/white, mục khóa học dạng chỉ mục ngang và thanh định hướng màu vàng nằm trong src/redesign.css. Menu mobile dùng dialog có focus loop, Escape, trả focus về nút mở và tôn trọng Reduced Motion.

## Form demo

Chọn learning path điền sẵn Learning goal. Form kiểm tra blur/submit, báo lỗi cạnh trường và focus lỗi đầu tiên. Submit hợp lệ hiển thị kế hoạch mẫu ngay trên trang; không gửi request, lưu dữ liệu hay gửi email.

## Kiểm tra trình duyệt

Sau khi chạy Vite, dùng npm run test:browser (mặc định http://127.0.0.1:5173; đổi qua QA_URL). Script kiểm tra desktop, tablet, mobile 375px và landscape: nội dung đủ ba bước, không tải video/ZIP, không tràn ngang, link cộng đồng, Reduced Motion và chữ phóng lớn trong mục hành trình học. Ảnh và báo cáo ở artifacts/light-motion/. Đây là Chromium giả lập thiết bị; chạy `npx playwright install chromium` khi máy chưa có trình duyệt.

## Hình ảnh

Toàn bộ ảnh cũ và pipeline tải stock đã được thay bằng sáu ảnh riêng cho sáu vị trí: học viên, bàn sáng tạo, học nhóm, lập trình, hội thoại ngôn ngữ và lập kế hoạch học. Không lặp ảnh giữa các mục. Tệp WebP tối ưu nằm trong public/images/. Ảnh là hình minh họa, không phải chân dung học viên thực tế.
