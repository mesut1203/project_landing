# Media Apex Motors

## Nguồn đang dùng

- `src/assets/ezgif-7893fd5aaba20c46-jpg.zip`: 160 JPEG, mỗi frame 1280 × 720.
- `src/assets/car-web.mp4`: 1280 × 720, 24 fps, khoảng 10 giây.
- ZIP lấy mẫu khoảng 16 fps. Bản website sử dụng 160 WebP từ ZIP, đánh số `0000` đến `0159`.
- Chạy `npm run media:prepare` để tạo lại `public/media/` từ ZIP. File gốc được giữ nguyên.
- Các frame desktop tổng cộng khoảng 2.83 MiB; chỉ tải một vùng nhỏ quanh vị trí đang xem.

## Giới hạn đã xác minh

Bộ nguồn có watermark hình ngôi sao ở góc phải, huy hiệu nhà sản xuất trên xe và thay đổi mẫu xe giữa studio và đoạn đường ven biển. Có các cú cắt trong nguồn, nổi bật ở frame 64 (đếm từ 0); các thay đổi hình ảnh lớn khác ở 23, 44, 88 và 129.

Việc scrub liên tục qua chỉ số frame không biến những cú cắt này thành một hành trình camera liền mạch. Website giữ nguyên nguồn trong bản xem thử, không xóa watermark, không tuyên bố đã đạt continuity của bản phim cuối.

**Chưa có bộ portrait 9:16.** `media.mobile.enabled` đang là `false`. Mobile dùng `mobile-static.webp`, một ảnh cuối được giảm xuống 720 × 405 và giữ toàn bộ khung hình. Đây là fallback tĩnh trong normal document flow, không phải video portrait hay landscape được crop giả làm portrait.

## Thay bằng bộ media hoàn chỉnh

1. Cung cấp phim landscape và portrait quay/render độc lập, cùng xe, màu sơn, mâm, hướng camera và color grading; không có watermark, chữ hoặc logo nhúng.
2. Hành trình: studio → đường ven biển bình minh → điểm nhìn hoàng hôn. Mỗi cảnh sau bắt đầu bằng frame cuối thực tế của cảnh trước. Giữ hướng và tốc độ camera tại điểm nối.
3. Xuất WebP riêng vào `public/media/sequence/desktop/` và `public/media/sequence/mobile/`, tên `frame-0000.webp`, `frame-0001.webp`... Không phóng to media có độ phân giải thấp.
4. Với mobile, có thể bắt đầu ở 720 × 1280, 18 fps. Giữ xe trong vùng trung tâm an toàn; dành negative space cho opening và final copy.
5. Cập nhật `media`, `story.scenes`, poster và final poster trong `src/data/content.ts`. Đặt đúng `frameCount`, `width`, `height`, `fps`, `frameStart`, `frameEnd` và `enabled`.
6. `frameEnd` của scene trước bằng `frameStart` của scene sau khi hai scene dùng chung frame biên trong sequence nối liền. Các mốc progress phải liên tục từ 0 tới 1.
7. Bật `media.mobile.enabled` sau khi bản portrait đã tồn tại. Không bật bằng đường dẫn landscape.
8. Chạy lại kiểm tra breakpoint, request cancellation, memory, reduced motion và kiểm tra từng seam ở cả hai chiều trong trình duyệt. Các kiểm tra fallback mobile hiện tại cần cập nhật theo bộ portrait mới.

## Cách tải và hiển thị

- `useMediaQuery` chọn một biến thể trước khi mount `FrameSequence`. Không render hai canvas rồi ẩn một bằng CSS.
- `FrameBuffer` dùng `AbortController`, tải tối đa 3 request desktop / 2 request mobile và giữ tối đa 20 / 9 decoded frame theo cấu hình hiện tại.
- Di chuyển nhanh sẽ hủy request ngoài vùng quan tâm. Unmount/breakpoint/reduced motion sẽ abort tất cả request và gọi `ImageBitmap.close()`.
- Tải lỗi được thử lại tối đa hai lần, giữ poster, có nút retry và không chặn các section khác.
- Reduced motion chỉ hiển thị final poster và nội dung theo flow bình thường; không tải sequence.
- Mobile hiện tại không tải frame desktop. Những ảnh editorial bên dưới story vẫn được lazy load khi gần viewport.

## Định hướng render nếu tạo lại media

Architecture A của `scroll-world`: ba camera leg nối bằng frame cuối thực tế, không có các connector bay lên/quay ngược. Một model video cho cả hai chain, mỗi chain tự truyền frame biên của chính nó. Không tạo video trả phí trong lần triển khai này vì người dùng đã cung cấp tài nguyên nguồn.
