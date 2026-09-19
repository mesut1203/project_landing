# Nâu Coffee — Design system

## Định hướng

Landing page quán cà phê bằng tiếng Việt, cảm giác ấm, chậm rãi và gần gũi.
Phối ảnh thật, nền nâu espresso, giấy kem và chữ serif có nét cổ điển.
Tài liệu được soạn trực tiếp theo Quick Reference của skill `ui-ux-pro-max`;
không chạy CLI tra cứu vì môi trường hiện không có Python.

## Màu và chữ

| Token | Giá trị | Vai trò |
| --- | --- | --- |
| `--color-cream` | `#f7f3ec` | Nền trang |
| `--color-paper` | `#fffaf2` | Ghi chú và bề mặt sáng |
| `--color-sand` | `#eee5d8` | Phần câu chuyện và dải giá trị |
| `--color-brown` | `#513626` | Nút chính và phần ghé quán |
| `--color-espresso` | `#2a1c15` | Nền hero |
| `--color-ink` | `#3d291e` | Chữ chính |
| `--color-muted` | `#6b594c` | Chữ phụ, đủ tương phản trên nền kem và cát |
| `--color-caramel` | `#a97950` | Điểm nhấn trang trí và focus |

- Tiêu đề: Cormorant Garamond, normal và italic.
- Nội dung: Be Vietnam Pro, trọng lượng 400/500/600.
- Font WOFF2 lưu trong `public/fonts/`, có `font-display: swap` và giấy phép OFL đi kèm.
- Dùng `src/index.css` làm nguồn token màu và font.

## Bố cục

1. Điều hướng, logo chữ và CTA “Ghé Nâu”.
2. Hero: lời mời, ảnh cà phê lớn và CTA đến thực đơn.
3. Dải giá trị: hạt Việt, cách pha, không gian.
4. Thực đơn: lọc cà phê / trà / bánh, xem chi tiết, lưu món.
5. Câu chuyện: ảnh không gian, nội dung và hai nguyên tắc.
6. Bộ ảnh: bố cục lệch cao độ trên desktop, lưới gọn trên mobile.
7. Ghé Nâu: địa chỉ, giờ mở cửa và liên kết Google Maps.
8. Footer: logo, liên kết đầu trang và ghi chú concept.

Container tối đa 1248px. Khoảng cách section desktop 104px, mobile 64px.
Góc bo 3–5px, viền mảnh. Không dùng bóng nặng. Hero có chuyển động chậm của ảnh nền, ánh sáng, mặt cà phê và hơi nóng.

## Tương tác và khả năng truy cập

- Bộ lọc dùng button với `aria-pressed`, không gán role tab khi không triển khai bàn phím tab đầy đủ.
- Chi tiết món và bộ ảnh dùng native `dialog`: focus được giữ trong cửa sổ, Escape đóng và trả focus về nút mở.
- Món yêu thích lưu bằng localStorage; khi lưu bị chặn, giữ state trong phiên và thông báo rõ.
- Nút bấm chính tối thiểu 44px; nút biểu tượng 48px.
- Có skip link, focus ring, alt ảnh, phân cấp tiêu đề và trạng thái được đọc bởi screen reader.
- Chuyển động nhẹ 220ms; tắt animation, transition và cuộn mượt với `prefers-reduced-motion`.
- Hiệu ứng hero tự chạy và tự dừng khi hero ngoài màn hình hoặc tab bị ẩn. Ảnh và lớp hơi nóng dùng chung tọa độ để luôn khớp với cốc trên desktop và mobile.
- Các khối nội dung có hiệu ứng hiện dần và trượt 36px theo hướng cuộn, lặp lại khi quay về khối đó. Các phần tử cùng nhóm xuất hiện cách nhau 80–100ms. Mobile giảm quãng trượt còn 22px và thời lượng còn 650ms; desktop 800ms. Tắt hiệu ứng với `prefers-reduced-motion`, hiện ngay nội dung nhận focus và khi in. Nội dung luôn hiển thị nếu trình duyệt không hỗ trợ hiệu ứng.
- Trang dùng một bảng màu cố định, `color-scheme: light`; các vùng nền nâu được kiểm tra tương phản riêng.

## Nội dung mẫu

Nâu là thương hiệu concept. Địa chỉ, giờ mở cửa, giá và thành phần là dữ liệu minh họa.
Ảnh là ảnh minh họa từ Unsplash, có thể được dùng lại cho nhiều món trong cùng nhóm.
Thay dữ liệu bằng thông tin quán thực tế trước khi sử dụng công khai.
