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

## Vòng QA P-C → P-D

| Vòng | Phát hiện | Sửa và đo lại |
|---|---|---|
| 1 | Ảnh 390×844 cho thấy cụm Orbit gần nút đổi edition. Ảnh Closing chụp đúng lúc blur làm đoạn dẫn khó đọc. | Đưa cụm ảnh mobile xuống cung dưới, ưu tiên lớp nút prev/next, giảm blur đoạn chữ và giữ fade/rise. Thêm hạt SVG hội tụ vào hình khiên trong khung Closing. |
| 1 | Firefox `reading_layout` gặp timeout khi neo Zodiac đang cuộn. Route wrapper chuyển động phần tử main trong lúc browser tính vị trí neo. | Animated Content chỉ dịch section mở đầu. Không dịch toàn bộ main chứa đích neo. Giữ nguyên bài test gốc. |
| 1 | axe gắn cờ contrast và label, ma trận thấy target dưới 44px ở footer, Chat và Story. | Tăng độ đậm của chữ nhỏ, dùng màu accent chữ cho tiêu đề sáng, tăng target theo cụm. Chạy lại axe và các luồng đọc. |
| 2 | Job local ban đầu chỉ dùng Firefox cho ảnh. Bậc Chromium bổ sung thành công bằng headless shell 153.0.8010.0 từ package `@sparticuz/chromium` nằm trong vùng QA nội bộ. | Đo CDP cùng binary cho baseline và ứng viên. Artifact CI dùng binary Playwright chính thức. Báo hai môi trường riêng. |

| Vòng | Phát hiện | Sửa và đo lại |
|---|---|---|
| 3 | CI P-D đầu có 450 lượt Chromium và 450 lượt Firefox. Cổng layout tự động 0 lỗi cứng, vẫn có ca mục tiêu nhỏ/clipped cần soi và rule axe về contrast hoặc tên. WebKit P-A qua 5/7 suite, gặp retry chunk lỗi và điều kiện font fallback sớm. | Đã tăng mục tiêu chạm từ các phát hiện, làm đậm màu và giữ nguyên ghi nhận axe. Cử chỉ thật CDP chỉ có ở Chromium, các engine khác kiểm nút/phím và viewport. |
| 3 | CI P-D đầu CPU 4× mobile 60,00 → 59,90 FPS, CLS 0,000500 → 0,000584. Desktop 55,10 → 55,73 FPS, long task giảm từ 0·0·1 xuống 0·0·0. | Giữ chiều cao header, dùng nền đục khi cuộn để giảm chi phí backdrop, ổn định độ rộng Count Up, canvas chỉ chạy đúng vùng ảnh. |
| 4 | Firefox ở viewport 320×740 và 768×1024 dừng điểm neo Zodiac lần lượt 212px và 228px dưới đỉnh thay vì 104px. Vòng thử CPU local vẫn có FPS/CLS lệch so baseline. | Dùng Link theo router và tính vị trí neo từ scroll padding. Hai suite Firefox reading_layout/scene_regressions qua trên 9aa40a9. Chuyển 12 hạt Closing sang CSS để giữ hình ảnh và giảm cập nhật JS. |
| 4 | Chromium local qua 7 suite gồm ca mới, Firefox cục bộ có lần first_scene không tìm thấy noscript dù HTML build có fallback. Firefox motion_smoke CI từng lỗi reset bài chat, WebKit từng lỗi retry chunk và timing loader trên runner. | Giữ nguyên ca kiểm chứng. Xem run mới nhất để phân biệt kết quả build sau sửa neo với run cũ. Thiết bị vật lý cần kiểm riêng. |
| 5 | Trace layout-shift trên mobile gắn lỗi cho đầu Zodiac ngay khi nội dung Watch Passport trước đó đổi chương. | Giữ chỗ bằng chiều cao nội tại của chương cao nhất, giảm cập nhật React khi chỉ số chương không đổi. Chromium và Firefox qua test hình học mới. |
| 6 | Local 8a4cf5f giảm CLS mobile từ 0,000837 xuống 0,000033, FPS mobile 53,11 → 52,32. | Thay bốn nền blur tĩnh lớn bằng radial gradient cùng tông. Giữ canvas, Orbit, text animation và Slide Commit. Recheck d7901a1: mobile 54,87 → 52,14 FPS, desktop 42,03 → 47,88 FPS, CLS mobile 0,001022 → 0. Cổng local còn đỏ vì FPS mobile. |

Artifact đối chiếu P-D đầu có [ảnh/JSON Chromium](https://github.com/FynisFL/SafeKid_Web_Demo_Prototype/actions/runs/44506467740/artifacts/14520705788), [Firefox](https://github.com/FynisFL/SafeKid_Web_Demo_Prototype/actions/runs/44506467740/artifacts/14519358791) và [Lighthouse/CDP/ảnh trước-sau](https://github.com/FynisFL/SafeKid_Web_Demo_Prototype/actions/runs/44506467740/artifacts/14520192481).

## Xác minh lại vòng 6 trên CI

Ứng viên d7901a1 so với 89c2154 trên cùng runner Chromium Playwright. Job hiệu năng qua. CPU 4× mobile 59,46 → 59,79 FPS, không phát hiện long task trong 3 lượt mỗi build, CLS tối đa 0,000550 → 0. Desktop 46,26 → 53,29 FPS, CLS 0,000060 → 0,000041. Mạng thường Hero +6 ms, LCP +16 ms. Bảng FINAL_REPORT ghi riêng hồi quy FPS mobile ở local và Lighthouse. [Device Matrix](https://github.com/FynisFL/SafeKid_Web_Demo_Prototype/actions/runs/44510529792) · [Ảnh và JSON thô](https://github.com/FynisFL/SafeKid_Web_Demo_Prototype/actions/runs/44510529792/artifacts/14523987300).

Browser Review qua. Chromium qua 8/8 suite và Firefox qua 7/8. Full motion_smoke của Firefox không về trạng thái chat mới sau thao tác New, trong khi bước đó qua khi chạy độc lập trên Firefox local ở ba viewport. Detector layout không báo lỗi cứng trong 450 ca của mỗi engine. Audit tiếp tục gắn cờ vùng chạm, nghi vấn clip, contrast và tên truy cập. [Browser Review](https://github.com/FynisFL/SafeKid_Web_Demo_Prototype/actions/runs/44510529835) · [Firefox](https://github.com/FynisFL/SafeKid_Web_Demo_Prototype/actions/runs/44510529792/job/135513292653).

WebKit hoàn tất đủ 450 ca viewport × route, detector báo 0 lỗi layout cứng. Suite qua 5/8. `motion_smoke` không khôi phục được Product sau lỗi tải chunk. `responsive_review` vẫn thấy cảnh Zone khi chờ SOS. `first_scene` phát hiện overlay đã xuất hiện trong ca font fallback sớm. `scene_regressions` qua. Audit ghi 368 ca chứa target dưới 44px và 16 ca có dấu hiệu clip. [Log WebKit](https://github.com/FynisFL/SafeKid_Web_Demo_Prototype/actions/runs/44510529792/job/135513292957) · [Ảnh và JSON WebKit](https://github.com/FynisFL/SafeKid_Web_Demo_Prototype/actions/runs/44510529792/artifacts/14523664854).
