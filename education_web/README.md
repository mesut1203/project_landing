# Learn Forward

Landing page giáo dục bằng **React 19, TypeScript, Tailwind CSS 4 và Vite 8**.

## Chạy dự án

```bash
npm install
npm run dev
```

Mở URL Vite hiển thị, mặc định http://localhost:5173. Trên PowerShell, có thể dùng `npm.cmd` nếu `npm.ps1` bị chặn. Node.js 22.12+ hoặc 24 được hỗ trợ bởi cấu hình dự án; đã kiểm tra với Node.js 24.

```bash
npm run build    # TypeScript + bản production tại dist/
npm run preview  # Xem bản production
npm run lint     # Oxlint
npm test         # Kiểm thử trang, video cuộn và form
npm run format   # Prettier
```

## Cấu trúc

```text
src/
  components/
    Navbar.tsx
    Hero.tsx
    LearningPaths.tsx
    HowItWorks.tsx
    Community.tsx
    SignupForm.tsx
    Footer.tsx
    Reveal.tsx
  data/content.ts           # Toàn bộ copy, ảnh, alt text và CTA
  hooks/useReducedMotion.ts
  hooks/useVideoScroll.ts
  App.tsx                   # Trang chính hiển thị ngay khi mở
  index.css                 # Tailwind, fonts và design tokens
  App.css                   # Layout, responsive và animation
public/
  videos/learning-world-zip.mp4  # Video dựng từ ZIP của người dùng
  videos/learning-world-source.json # Hash nguồn và kết quả so khớp 50 frame
  images/                   # Ảnh WebP và poster phục vụ tại local
tests/                      # Kiểm thử React bằng Vitest + jsdom
design-system/MASTER.md      # Quy tắc thiết kế của Learn Forward
```

## Mở trang

Trang hiển thị ngay hero, menu và nội dung; không có video intro, màn chờ hoặc khóa cuộn. Video chỉ xuất hiện trong section “Learn. Practice. Grow.” và được điều khiển bằng thao tác cuộn.

## Section cuộn “Learn. Practice. Grow.”

`HowItWorks` dùng `public/videos/learning-world-zip.mp4`, dựng **đúng từ 50 JPG liên tiếp** trong `src/assets/ezgif-869e7c93d25206b9-jpg.zip`. ZIP không chứa MP4 hay thông tin thời gian; lựa chọn đóng gói là 10 fps / 5 giây, còn tốc độ xem do cuộn quyết định. Video giữ 1280×720, không thêm cảnh hay frame nội suy. Script so sánh toàn bộ 50 frame đầu ra với ảnh ZIP theo đúng thứ tự: SSIM 0.996701. Hash ZIP, từng JPG, MP4 và kết quả so sánh ở `public/videos/learning-world-source.json`. File video intro cũ không còn được dùng cho section.

Desktop dùng khung video rộng với chữ phủ phía dưới; điện thoại giữ toàn bộ khung 16:9, nội dung nằm trên nền xanh nhạt bên dưới. Ba nút Learn / Practice / Grow vừa hiển thị tiến độ vừa cho phép cuộn đến chương tương ứng. Các mốc 0%, 36%, 70% khớp diễn biến từ bàn học đến ý tưởng và lớp học. Không autoplay hay loop.

- `src/hooks/useVideoScroll.ts`: ánh xạ cuộn sang thời gian, làm mượt bằng rAF và đợi seek đang chạy hoàn tất trước khi gửi vị trí mới nhất. Video được tải dưới dạng Blob để tua được trên host thiếu HTTP Range; có AbortController và thu hồi object URL khi unmount.
- `src/components/HowItWorks.css`: khung sticky dưới navbar, khoảng cuộn 340svh desktop / 280svh mobile. Không tạo bản portrait riêng.
- Poster khớp frame đầu của video luôn hiện trong khi chờ video có hình. Thiết bị cảm ứng có thao tác play/pause ngắn để khởi tạo decoder sau tương tác đầu tiên.
- Reduced motion, lỗi tải/decode, tải quá 15 giây hoặc seek đứng quá 5 giây: hiển thị ảnh tĩnh và toàn bộ ba bước, bỏ ghim section. Cửa sổ thấp ≤560px cũng hiển thị nội dung theo chiều dọc để tránh che chữ.
- Link **Continue to community** cho phép bỏ qua hành trình cuộn. Video chỉ bắt đầu tải khi section đến gần viewport.

`tests/HowItWorks.test.tsx` kiểm tra đúng URL video từ ZIP, điều hướng chương, tải Blob, cuộn ngược, gộp seek khi cuộn nhanh, poster, tải gần viewport, reduced motion, lỗi tải, seek đứng và StrictMode cleanup.

Dựng lại bằng lệnh dưới đây. Script đọc ZIP bằng Node (không cần giải nén thủ công hay PowerShell), giữ độ phân giải gốc, H.264 CRF 18, GOP 4 và faststart; đồng thời xuất poster khớp frame đầu và báo cáo đối chiếu.

```bash
npm run media:world
npm run build
```

## Tài nguyên stock cũ (tùy chọn, Windows)

Video và ảnh thành phẩm đã có sẵn; **không cần FFmpeg để chạy hoặc build website**. Gói FFmpeg cho Windows được khai báo optional để không chặn cài đặt trên hệ điều hành khác. Các lệnh dưới chỉ dựng bộ stock cũ và ảnh của những section khác; video cuộn từ ZIP được dựng riêng bằng `media:world`.

```bash
npm run media:fetch  # Tải footage thật từ các trang nguồn Mixkit
npm run media:build  # Dựng video nguồn, poster và ảnh WebP bằng FFmpeg
```

Nguồn tạm ở `.media-source/`, đã được gitignore. Nếu các JPG nguồn chưa có, chạy `powershell -File scripts/download-assets.ps1` để tải lại.

## Form demo

Các CTA dẫn tới learning paths hoặc form. Chọn một learning path sẽ chọn sẵn **Learning goal**. Form có **Learning goal**, **Experience level**, **Email**; kiểm tra khi blur/submit, hiện lỗi cạnh trường và focus vào trường lỗi đầu tiên.

Submit hợp lệ tạo một **kế hoạch mẫu ngay trên trang**. Không gửi request, không lưu vào localStorage, không gửi email. Có thể sửa lựa chọn. Dòng `Demo form. Connect a service to receive submissions.` luôn hiện rõ. Chưa kết nối backend, tài khoản, khóa học thật hoặc cộng đồng thật.

## Animation và accessibility

Animation giao diện dùng `opacity` và `transform`; video section dùng `currentTime` theo cuộn. Reveal dùng IntersectionObserver + Web Animations API; hero zoom nhẹ theo CSS scroll timeline ở trình duyệt hỗ trợ. Trình duyệt thiếu các API vẫn hiển thị nội dung. Reduced motion tắt animation và thay video cuộn bằng poster. Navbar cố định nằm ngoài phần tử bị transform để không mất fixed positioning.

Các breakpoint chính: 768px, 1024px, 1200px; bổ sung cho màn hình 320–420px và landscape thấp. Ảnh giữ tỷ lệ cố định để tránh layout shift; fonts local với `font-display: swap`.

## Kiểm tra

`npm test` kiểm tra trang hiển thị và tương tác ngay, chỉ còn video section, cuộn tiến/lùi, gộp seek, poster, tải chậm/lỗi, reduced motion, StrictMode cleanup, validation và việc form không gửi/lưu dữ liệu.

`npm run test:scroll-browser` chạy kiểm tra Chrome headless khi Vite đang chạy tại `http://127.0.0.1:5173` (đổi bằng biến `QA_URL`). Đã kiểm tra 1440×900, 1366×768, 390×844 và 375×667; mobile giả lập touch với CPU chậm 4×. Kiểm tra 32 vị trí cuộn tiến/lùi, nguồn video đúng, seekable, trạng thái pause, nút chương, tràn ngang và reduced motion. Ảnh chụp và báo cáo ở `artifacts/scroll-world/`. Đây là Chrome giả lập điện thoại, chưa phải kiểm tra trên Safari/iPhone thật.

## Nguồn media

Video cuộn hiện tại chỉ lấy từ ZIP do người dùng cung cấp. Bộ stock trước đây được tải từ các trang dưới, được giữ làm tài nguyên cũ; ảnh hero vẫn dùng footage stock này:

- [Panning Shot of College Study Desk](https://mixkit.co/free-stock-video/panning-shot-of-college-study-desk-101309/)
- [A student making notes and mathematical charts](https://mixkit.co/free-stock-video/a-student-making-notes-and-mathematical-charts-on-the-notebook-50109/)
- [Girl working on the floor of a library](https://mixkit.co/free-stock-video/girl-working-on-the-floor-of-a-library-4518/)
- [Girl doing homework in a library](https://mixkit.co/free-stock-video/girl-doing-homework-in-a-library-4531/) (cũng là nguồn ảnh hero)
- [Mixkit license](https://mixkit.co/license/#videoFree)

Ảnh các section được chuyển sang WebP từ ảnh Unsplash có trong dự án: Christopher Gower (laptop), ảnh sách/sổ ghi chép và nhóm học viên. Đường dẫn tải gốc nằm trong `scripts/download-assets.ps1`. Đây là ảnh stock minh họa, không phải testimonial hay học viên của một nền tảng đang hoạt động.

Tài liệu: [Vite](https://vite.dev/guide/), [Tailwind + Vite](https://tailwindcss.com/docs/installation/using-vite), [HTMLMediaElement.play](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play), [CSS animation-timeline](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline).
