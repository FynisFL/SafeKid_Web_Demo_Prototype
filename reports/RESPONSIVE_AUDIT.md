# SafeKid · Audit responsive đầu PR #6

Firefox 153 headless với production build từ cây source `89c2154`. 14 URL × 18 viewport. Context dọc/ngang dùng touch giả lập và DPR 2. `reduced-motion` bật trong lượt đo layout để tách hình học khỏi animation. Font và gọi đi ngoài preview bị chặn trong lượt này. Firefox Playwright không cung cấp giả lập `isMobile` như Chromium/WebKit, vì vậy đây là rà soát viewport và CSS tĩnh.

| Nhóm | Viewport CSS px |
|---|---|
| Điện thoại dọc | 320×568, 344×882, 360×640, 375×667, 390×844, 412×915, 430×932 |
| Điện thoại ngang | 667×375, 844×390, 932×430 |
| Tablet | 768×1024, 820×1180, 1024×768, 1180×820 |
| Desktop | 1280×720, 1366×768, 1440×900, 1920×1080 |

Tất cả 252 lượt đều tìm thấy `main h1`. Không ghi nhận lỗi JavaScript qua `pageerror` hay scrollWidth của body/root vượt viewport hơn 1px trong lượt đo. `src/index.css` đang đặt `overflow-x: clip` cho body, nên cần kiểm thêm bounding box của nội dung tương tác trước khi kết luận về clipping. Chỉ số scrollWidth của văn bản cũng cần đối chiếu vì có nhãn sr-only và rail cuộn có chủ đích.

| Trang | Điện thoại dọc | Điện thoại ngang | Tablet | Desktop |
|---|---|---|---|---|
| Home | `Discover SafeKid` kết thúc ở y=430 tại 360×640. Menu 40px. | Story phải dùng luồng thấp thay stage ghim. `reading_layout` qua 844×390. | Layout tĩnh qua. Cần thử giữ chương khi quay từ ngang sang dọc. | `reading_layout` qua 1440×900 và 2712×1220. Tải cuộn CPU 4× còn cần đo. |
| Zodiac | `Explore all 12 editions` trong intro. Ảnh và bộ chọn đã qua hồi quy. Kiểm riêng tương phản từng tint. | Rail cuộn ngang cục bộ. `reading_layout` và điều hướng qua. | Tăng cột chủ động và khoảng đọc vừa đủ. Giữ trạng thái edition khi đổi layout. | Điều hướng chi tiết, Back/Forward và focus tìm kiếm đã qua Firefox. |
| Product Dragon | Breadcrumb, gallery, CTA trong luồng đọc. Kiểm hộp zoom ảnh ở 320px và phóng 200%. | Modal image dùng `dvh`. Cần kiểm swipe/đóng modal điều hướng bằng phím và chạm. | Kiểm gallery portrait và chuyển từ Zodiac. | `collection_navigation` đã kiểm Back/Forward và deep link qua stage. |
| Watch Passport | `Open the sample passport` kết thúc y=450 tại 360×640. | Giữ ba tùy chọn Core/Skin/Skill gần sơ đồ. | Cần test xoay khi đang chọn Skill ở build mới. | Sơ đồ và timeline có nội dung mẫu, nhãn demo phải nằm cạnh CTA. |
| Parent App | `Open Web App` kết thúc y=355 tại 360×640. | Kiểm vùng Safe Zone và dialog tải APK ở chiều cao ≤430. | Layout tĩnh qua. Cần kiểm canvas lúc offscreen. | Đo SignalStage, giới hạn nền theo scene và xác nhận điều kiện tải APK. |
| About | Đọc theo panel tuần tự được. | Giữ fallback tuần tự khi thấp. | Kiểm hình/nhãn team ở 768 dọc. | `h-screen` và ngưỡng 650px cần xác nhận viewport thấp trước khi ghim. |
| Support | `Browse common questions` kết thúc y=407 ở 360×640. Một số link text thấp hơn 44px theo phép đo. | Cần thử accordion và focus trên màn thấp. | Tái sử dụng layout FAQ. | Kiểm sự khác biệt rõ của trạng thái mở, đóng và focus. |
| Contact | 4 trường tại 14px xuyên 7 viewport dọc. `Write to the SafeKid team` y=381 tại 360×640. | Kiểm keyboard thật và nút mở thư nháp. | Input 14px hiện còn trên viewport chạm lớn. | Form mở thư nháp qua `mailto:`, cần giữ nguyên khi thêm chuyển động. |
| Chat / S.F AI | Composer 13px, nút gửi y≈1198 tại 360×640 ở trạng thái đầu. Thêm đường tới composer trong màn đầu. | Cần kiểm phần nhập khi bàn phím ảo mở và khi đổi hướng. | Giữ nội dung hội thoại và draft khi xoay. | Kiểm long string, focus, trạng thái dừng và composer dùng phím. |
| SOS | Kiểm khoảng cách từ nội dung demo tới điều khiển hold và phương án bấm. | Cần kiểm minh họa và nút mô phỏng ở chiều cao thấp. | Cần kiểm tình huống hủy khi chuyển focus hoặc tab. | Duy trì vòng hold, chú thích no emergency alert và reset. |
| Cart / Checkout | Trạng thái giỏ rỗng qua layout. Kiểm bar khi có sản phẩm và số lượng lớn. | Cần thử portal thanh tổng, notch và chuyển phương thức mẫu. | Giữ giỏ hàng và phương thức khi xoay. | Giữ phần tóm tắt sticky trong chiều cao lay-out thực tế. |
| 404 | Nút về Home kết thúc y=447 tại 360×640. | `78vh` cần kiểm với thanh địa chỉ. | Layout tĩnh qua. | Kiểm đường dẫn trực tiếp cùng trang 404 đã sinh. |
| Header / Footer | Open menu 40×40px, logo và link footer nhỏ tùy vị trí. | Kiểm notch ngang và cuộn dialog. | Search, túi và menu cùng xuất hiện ở tablet. | Giữ khả năng đọc và focus khi navbar đổi layout, chỉ một progress. |

## Việc cần kiểm trên thiết bị thật

- iPhone Safari. Mở Home và Zodiac trên điện thoại dọc. Thu/mở thanh địa chỉ khi vuốt, sau đó xoay. Quan sát Hero và stage sticky, lớp canvas hoặc hình tĩnh. Kiểm vùng notch và home indicator với header, dialog, thanh giỏ. Focus vào Contact và S.F AI, xác nhận bàn phím không che trường đang nhập và nút gửi. Lặp với Reduce Motion và Low Data Mode nếu có.
- Android Chrome. Thử ở 360–430 CSS px và 844×390 tương đương. Vuốt dọc qua rail Zodiac rồi vuốt ngang trong rail. Mở edition, Back và xoay, xác nhận đúng edition và scroll. Kiểm trường nhập, cỡ chữ hệ thống lớn, thanh địa chỉ và trải nghiệm cuộn ở chế độ pin thấp.
- Cả hai. Soát nút 44×44px, zoom 200%, nhãn demo, dialog Escape với bàn phím ngoài, đổi app trong khi chạy cảnh hoặc mô phỏng. Mobile được coi là nghiệm thu khi test thực sự thực hiện và ghi thiết bị/OS/trình duyệt.

### Bổ sung khi nghiệm thu PR #10

- Trên iPhone Safari, bấm “Explore all 12 editions”. Kiểm tra đầu sân khấu nằm dưới header. Thử nút trước/sau, ảnh Orbit, sang Product và Back. Lặp ở portrait và landscape.
- Thử mở bản nháp Contact bằng nút và Slide Commit khi trường bắt buộc còn trống. SOS chỉ mô phỏng cục bộ. Thử hold, slide, Enter và Reset trước khi xoay.
- Trên Android Chrome, chuyển tab ngay khi thấy hạt Hero, quay lại và cuộn. Lặp với Reduce Motion, Data Saver hoặc pin yếu nếu máy hỗ trợ.
