# SafeKid · Thành phần React Bits và chuyển động

Cập nhật ngày 20/11/2026 theo bản phát hành f92098d. Bảng dưới là trạng thái mã nguồn hiện hành. Tên gọi thành phần giữ nguyên để đối chiếu với mã nguồn và ghi nguồn đầu tệp.

## Thành phần đã tích hợp trên bản phát hành

| Thành phần | Vị trí chạy | Phiên bản SafeKid |
|---|---|---|
| Animated Content | SiteLayout và Parent App | Wrapper ngữ nghĩa, slide/opacity ngắn qua WAAPI, nội dung có từ render đầu. |
| Scroll Float | Heading phụ Closing và Passport | Dịch dọc khi vào viewport, giữ `h1` và văn bản HTML. |
| Scroll Reveal | Dẫn nhập Closing và Passport | Mờ/rise ngắn, giữ văn bản chọn được. |
| Orbit Images | Sân khấu Zodiac | 12 ảnh trên tablet/desktop, 5 ảnh điện thoại. Selection và Back dùng state có sẵn. |
| Slide Commit | SOS demo và Contact | Kéo xác nhận, bàn phím và nút hiện có. Contact giữ native validation và chỉ yêu cầu mở email nháp. |
| Count Up | Số edition trong Hero | Dùng Motion, screen reader đọc giá trị cuối. |
| Gradual Blur | Mép minh họa trang 404 | Ba lớp blur trong vùng 32px cố định. |
| Click Spark | Parent App | Bản từ trước, bổ sung dọn canvas khi tab ẩn hoặc ngoài viewport. |
| Spotlight Card | Parent App SignalStage | Bản gradient theo vị trí pointer đã ghi nguồn trong repo. |

Các bản TS-TW đã đọc qua `https://reactbits.dev/r/{name}-TS-TW.json`. Animated Content, Scroll Float và Scroll Reveal upstream dùng GSAP. Bản SafeKid giữ kiểu chuyển động và hợp đồng giao diện cần dùng bằng WAAPI/Motion. Slide Commit thay hai bộ icon upstream bằng Lucide có sẵn. Giữ license và URL ở đầu tệp. Các tính năng chính chưa bị cắt theo ngân sách.

## Bảng cân nhắc trước triển khai

Các trạng thái “chưa tích hợp”, “ứng viên” và chi phí dự kiến dưới đây thuộc kế hoạch ngày 19/11/2026. Khi bảo trì, dùng bảng hiện hành ở trên cùng các số đo trong FINAL_REPORT.

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
