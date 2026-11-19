# SafeKid · QA log baseline

**19/11/2026 · Trước phát triển.** Đây là log kiểm thử cho `89c2154` và không phải kết quả của vòng QA sau triển khai.

| ID | Lệnh hoặc công việc | Kết quả | Bằng chứng và phần tiếp theo |
|---|---|---|---|
| ENV-01 | `npm ci`, sau đó `npm ci --ignore-scripts --no-audit --no-fund --fetch-retries=0` | Bị chặn tự động | Bộ duyệt nói thao tác registry/node_modules trái với giới hạn cài đặt của lượt đọc skill trước. Lần thử thứ hai tắt lifecycle và cách ly worktree vẫn bị từ chối. Cần môi trường chấp nhận bước `npm ci` đã nêu trong Master Prompt. |
| BASE-01 | `npm run check` | Qua, lint 0 cảnh báo | Dùng checkout `a266faa` trùng cây Git PR #6 và dependency đã có. TypeScript app thoát 0. |
| BASE-02 | `npm run build` | Qua | Vite 7.3.7, có cảnh báo `use client` của dependency. Home ban đầu 15 tệp JS, 238.076 B gzip bằng Firefox resource entries. |
| BASE-03 | `SAFEKID_BROWSER=firefox python tests/collection_navigation.py` và `... tests/reading_layout.py` | Qua | Điều hướng/search hai chế độ và 7 viewport reading layout, gồm 844×390 và 2712×1220. Dùng cùng một phiên preview loopback với Playwright. |
| BASE-04 | Audit Playwright Firefox 153 headless | Đã đo 252 lượt | 18 viewport × 14 route, 0 lỗi pageerror và 0 root/body scrollWidth tràn theo phép đo. Phạm vi tĩnh, reduced motion, chưa có bàn phím ảo hoặc zoom thiết bị thật. Xem responsive audit. |
| BASE-05 | Home mạng thường, 5 cache lạnh Firefox | Đã đo | Hero 367 ms, LCP 321 ms trung vị. CLS thiếu `layout-shift` ở Firefox. Mẫu thô ghi trong review. |
| ENV-02 | Sáu tệp Playwright với `/usr/bin/chromium` | Khởi tạo browser bị chặn | Browser chết trước mở route do socket Unix `Operation not permitted`. Vì vậy chưa thể chạy CDP CPU/network, đo long task hoặc Lighthouse trên Chrome. Kết quả không phản ánh một lỗi của ứng dụng. |
| ENV-03 | `SAFEKID_BROWSER=webkit python tests/reading_layout.py` | Thiếu thư viện hệ thống | Binary có sẵn, thiếu `libgtk-4.so.1`, `libgraphene-1.0.so.0`, `libharfbuzz-icu.so.0`, `libmanette-0.2.so.0`, `libhyphen.so.0`, `libGLESv2.so.2`. Cần runner Playwright có system deps. Checklist Safari thật trong [Responsive audit](RESPONSIVE_AUDIT.md). |
| QA-01 | GitHub Actions trên đầu PR #6 | `cancelled` | [Run 44494827271](https://github.com/FynisFL/SafeKid_Web_Demo_Prototype/actions/runs/44494827271). |

Axe toàn site, so sánh long task/FPS/CLS, ba hồ sơ mạng có CDP, nghiệm thu ảnh sau redesign, ma trận sau sửa và thiết bị thật đều đang chờ. Chưa sửa hay nới test của repo. Không có vòng lặp sau phát triển để báo pass/fail.

## Gỡ blocker theo ủy quyền mới

| Bậc | Kết quả |
|---|---|
| a | `npm ci` trong worktree mới thoát 0, thêm 412 gói. Chạy build baseline từ cây nguồn đã đối chiếu với `89c2154`; build và check thoát 0. |
| b | Cài Chromium và thử riêng `--only-shell`: tải về thất bại với `End of central directory record signature not found. Either not a zip file, or file is truncated.` Probe hai binary Playwright báo thiếu executable. Chromium hệ thống thử ba cờ yêu cầu và báo `socket() failed: Operation not permitted (1)`. |
| c | `npm exec -- playwright install-deps webkit` báo `Switching to root user to install dependencies...`, rồi `Password: su: System error`. Dry run Python cũng báo thiếu package và không đọc được apt config. |
| d | PR #7 mở dạng nháp từ nhánh PR #6. Workflow matrix tách Chromium, Firefox, WebKit và job đo đối chứng với đúng SHA baseline. Git CLI push báo `fatal: could not read Username for 'https://github.com': No such device or address`; đã lưu commit qua GitHub connector. |
| CI cũ | Job `preview` của run 44494827271 qua npm ci, check, build, pip và bị hủy ở step cài browser. Kết quả job không chỉ ra được bên yêu cầu hủy. Workflow mới có timeout 35 phút, không hủy job do push khác. |
| P-A local | Firefox qua `device_regressions.py` tại 320×568, 390×844, 844×390 và 768×1024. `reading_layout.py` qua 7 cấu hình, gồm 2712×1220. |
