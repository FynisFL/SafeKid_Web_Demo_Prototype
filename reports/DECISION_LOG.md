# SafeKid · Nhật ký quyết định

> Cập nhật ngày 20/11/2026. Bản phát hành đã vào main tại f92098d qua PR #10. Phần dưới ghi dữ liệu và nhận định tại mốc lịch sử của từng mục. Trạng thái hiện hành nằm ở [PROGRESS.md](PROGRESS.md) và phần đầu [FINAL_REPORT.md](FINAL_REPORT.md).

| ID | Quyết định | Lý do | Cách đảo ngược hoặc kiểm chứng |
|---|---|---|---|
| D-01 | Lấy `89c2154` là base cho `codex/safekid-device-foundation`. | GitHub xác nhận đây là đầu PR #6. Commit `a266faa` địa phương có cùng cây source và khác SHA. | Giữ nguyên checkout cũ. Khi làm tiếp, xác minh lại PR #6 và cập nhật base nếu dự án có commit mới. |
| D-02 | Dùng dependency đã có ở checkout trùng cây source để chạy baseline đọc/kiểm thử. | Bộ duyệt tự động từ chối `npm ci` và `npm ci --ignore-scripts`. Hai checkout có cùng cây, manifest và lockfile. | Trong môi trường được cấp quyền, chạy `npm ci` trên worktree mới, so byte/chunk, cập nhật số baseline. Dùng kết quả mới nếu khác. |
| D-03 | Ưu tiên Motion, CSS, SVG, Canvas 2D và Embla trong đề xuất. | Đã có token và hạ tầng dùng được. Cần đo CPU 4× và tài nguyên trước khi tăng dependency. GSAP/ogl được Master Prompt cho phép có điều kiện. | Khi gặp hiệu ứng cụ thể cần engine khác, thử trong nhánh riêng, lazy và có cờ, so cùng browser/net/CPU trước khi chọn. |
| D-04 | Tái dùng tín hiệu turquoise cục bộ ở các stage. | Người dùng đã thấy đường bám cuộn làm khó đọc. Header có progress chức năng. | Giới hạn mọi thử nghiệm ở scene, tắt qua cờ. So ảnh tĩnh và đoạn có chuyển động. |
| D-05 | React Bits giữ ở bước chọn ứng viên trong phiên này. | Đã đối chiếu catalog và giấy phép, chưa có môi trường cài/đo/kiểm đủ. Hai bản tích hợp cũ của App có sẵn. | Khi cổng môi trường đạt, chọn từng gói TS-TW, so import và output build rồi quyết định một phần tử một lần. |
| D-06 | Dừng trước thay đổi source ứng dụng và trước mở các PR nháp. | Baseline Chromium/CPU 4× và WebKit chưa chạy được. Master Prompt yêu cầu cổng hiệu năng và cho dừng khi môi trường chặn. Một PR chỉ chứa báo cáo sẽ kích hoạt workflow chưa có baseline xác nhận. | Mở lại báo cáo, chạy baseline trên runner đủ browser/dependency, tiếp tục P-A rồi tạo stack theo đề xuất. |
| D-07 | Dùng Playwright 1.62.0, axe-core 4.14.1 và Lighthouse 13.6.0 trong package QA riêng ở `tests/`. | Chạy matrix, quét a11y và Lighthouse trên runner. Gói QA không được import vào runtime. | Xóa package QA và job tương ứng nếu thay công cụ. |
| D-08 | Tách job matrix theo engine và giữ kiểm tra đại diện trong browser review. | Lỗi tải/cài engine không dừng hai engine còn lại. Bản trước bị hủy tại bước cài cả ba engine trong một job. | Theo dõi thời gian từng job, chỉnh timeout từ dữ liệu runner. |

## Quyết định có hiệu lực sau phát hành

- D-02 và D-06 đã được thay thế bằng môi trường QA hoạt động, cài dependency và runner đủ ba browser. Giữ các mục cũ để giải thích lịch sử gỡ blocker.
- D-05 đã hoàn tất bước triển khai. Có 7 thành phần mới trong motion/reactbits và 2 kỹ thuật đã tích hợp ở app-experience, xem bảng React Bits hiện hành.
- Người dùng duyệt bản preview 9ad24e0. Đổi base PR #10 từ nhánh P-C sang main để hợp nhất toàn bộ chuỗi phụ thuộc trong một merge commit f92098d. Đây là mốc phát hành, các PR cũ không xác định trạng thái bản đang chạy.
- Tài liệu kỹ thuật dùng tiếng Việt. Tên mã nguồn, lệnh, API và nhãn sản phẩm giữ nguyên để tra cứu chính xác.
