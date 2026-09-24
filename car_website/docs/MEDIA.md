# Media Apex Motors

## Landing page hiện tại

Trang chỉ hiển thị ảnh WebP tĩnh từ `public/media/`. Hero dùng `ignition-desktop.webp` ở cả desktop và mobile, giữ tỉ lệ 16:9 trên điện thoại. Ảnh hero tải eager với ưu tiên cao; ảnh các section bên dưới tải lazy và có kích thước khai báo để hạn chế dịch chuyển bố cục.

Nếu ảnh lỗi, `MediaImage` hiển thị vùng thay thế có nhãn; tiêu đề và CTA vẫn dùng được.

## Nguồn lưu lại

- `src/assets/car-web.mp4`: video nguồn.
- `public/media/sequence/`: frame từ bản scroll trước, không còn được mã giao diện tham chiếu hoặc tải.

File ZIP nguồn và công cụ tạo ảnh từ ZIP đã được gỡ. Các ảnh WebP đã xuất được giữ lại và hoạt động độc lập; không cần giải nén hay chạy bước chuẩn bị media để phát triển hoặc build. Website không sử dụng video intro, canvas hay cơ chế scrub.

## Giới hạn ảnh nguồn

Ảnh hiện có watermark, huy hiệu nhà sản xuất và thay đổi mẫu xe giữa các góc chụp. Đây vẫn là bộ ảnh xem thử; cần thay bằng ảnh có nhận diện đồng nhất trước khi dùng cho thương hiệu thật.

Để thay ảnh landing, cập nhật `hero.image`, `model.image`, `performance.details`, `gallery.images` và `booking.image` trong `src/data/content.ts`, bao gồm alt và kích thước thực tế.
