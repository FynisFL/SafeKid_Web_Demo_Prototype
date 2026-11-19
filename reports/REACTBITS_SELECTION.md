# SafeKid · Bảng chọn React Bits trước triển khai

Catalog miễn phí và trang cài đặt được đối chiếu ngày 19/11/2026. Nhãn nhẹ/vừa/nặng dưới đây là đánh giá sơ bộ từ kiểu chuyển động. Ghi dependency và gzip thực tế sau khi xem nguồn TS-TW và build từng thành phần. [Catalog](https://reactbits.dev/get-started/index) · [Cách cài](https://reactbits.dev/get-started/installation)

| Thành phần | Mục đích SafeKid | Mobile, a11y, CLS | Chi phí dự kiến | Trạng thái vòng này |
|---|---|---|---|---|
| Animated Content | Card/panel vào lần đầu, biến thể theo vai trò | Giữ DOM, kích thước, focus và phần tử đã vào. Một owner cho mỗi transform. | Vừa, cần xem engine | Nòng cốt đã xác minh catalog. Chưa tích hợp. |
| Scroll Float | Một h2 ngắn của Home hoặc About | Giữ heading và không dùng cho h1/LCP. Mobile chuyển động nhỏ. | Vừa, kiểm scroll observer | Nòng cốt đã xác minh catalog. Chưa tích hợp. |
| Scroll Reveal | Một đoạn mở ngắn ở Passport/Home | Giữ văn bản chọn được, không dùng cho lỗi/form/giá/FAQ. | Vừa, kiểm blur và số layer | Nòng cốt đã xác minh catalog. Chưa tích hợp. |
| Orbit Images | Showroom Zodiac, tín hiệu chạy theo đường cục bộ | 2–3 ảnh trên mobile. Có nút hoặc rail, đồng bộ URL và Back. | Vừa tới nặng theo số ảnh, kiểm lazy và pause | Nòng cốt đã xác minh catalog. Chưa tích hợp. |
| Slide Commit | Bổ sung cho SOS/Contact/Checkout | Nút tương đương và một luồng hành động, test hủy drag và xử lý lỗi. | Vừa, cần xem dependency và gesture | Nòng cốt đã xác minh catalog. Chưa tích hợp. |
| Click Spark | Phản hồi đổi scene App | Giữ reduced-motion và ngừng canvas khi không thấy. | Vừa, canvas đời ngắn | Đã có `useClickSpark`, ghi nguồn. |
| Spotlight Card | Nổi trạng thái SignalStage, thử một gallery Product | Hover có phương án focus hoặc tint tĩnh. | Nhẹ tới vừa, hạn chế vùng gradient | App đã có phiên bản điều chỉnh, ghi nguồn. |
| Fade Content | Panel đọc nhẹ ở Support/About | Có thể trùng Animated Content. Chỉ dùng nếu thay được wrapper cũ. | Nhẹ nếu opacity | Ứng viên trùng vai trò, giữ dự phòng. |
| Glare Hover | Lướt sáng một lần trên mặt đồng hồ Product | Không che chữ, chỉ khi hover/focus phù hợp. | Nhẹ nếu CSS và vùng nhỏ | Ứng viên sau khi kiểm lại TiltCard. |
| Scroll Stack | Tách lớp Passport ở màn đủ cao | Fallback một cột, không khóa scroll hoặc che focus. | Vừa tới nặng, cần đo pin | Trì hoãn đến khi CSS/SVG được đo. |
| Count Up | Chỉ số mẫu Parent App khi đổi scene | Giá trị thật hiển thị ổn định cho screen reader. | Nhẹ nếu động một lần | Ứng viên nếu có chỉ số demo phù hợp, tránh chạy vào mỗi trang. |
| Hold Button | Chỉ báo lực giữ trong SOS demo | Giữ click thay thế và hủy ngay khi rời. | Vừa | Giữ phiên bản sẵn có trừ khi thêm cải thiện đo được. |
| Fuse Button | Hoàn tác xóa item khỏi giỏ | Undo có timer rõ, focus và live status phù hợp. | Vừa | Hoãn, hiện workflow giỏ hàng được bảo toàn. |
| Bell Toggle | Trạng thái thông báo demo trong Parent App | Nút trạng thái có tên, giữ chế độ im lặng của web. | Nhẹ tới vừa | Ứng viên khi có tuỳ chọn thực sự cần điều khiển. |
| Status Mark | Phản hồi mở email nháp hoặc APK sẵn sàng | Tạo từ trạng thái thực, không giả tiến độ. | Nhẹ tới vừa | Ưu tiên thử trước các hiệu ứng nền. |
| Laser Flow / Blob Cursor / Scroll Velocity | Điểm nhấn thử nghiệm có chi phí nền hoặc cuộn | Có rủi ro cản đọc và phản hồi xấu trên điện thoại. | Nặng hoặc chạy liên tục | Loại khỏi hướng mặc định. |

Quy trình thử từng gói sau khi cổng môi trường hoạt động. Xác minh nguồn, giữ thông báo ở đầu file và `public/licenses/react-bits.txt`, giữ code trong `components/motion/reactbits/`, kết nối token/cờ hiện có và giữ chức năng độc lập. Soát `git diff --stat` trước khi chấp nhận bất kỳ thay đổi registry nào. Giữ Motion/CSS nếu gate thất bại hoặc source khó tích hợp an toàn.
