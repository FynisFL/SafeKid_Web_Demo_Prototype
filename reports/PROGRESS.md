# SafeKid · Trạng thái phát hành

Cập nhật ngày 20/11/2026. Bản được người dùng duyệt 9ad24e0343182ce148522abe1fe912ae45cf6af5 đã hợp nhất vào main tại f92098de1533f7b2319b916bdc29916bd456ab96 qua [PR #10](https://github.com/FynisFL/SafeKid_Web_Demo_Prototype/pull/10).

| Phần việc | Trạng thái |
|---|---|
| P-A · Nền responsive và kiểm thử thiết bị | Đã triển khai |
| P-B · Bộ chuyển động dùng chung | Đã triển khai |
| P-C · Các cảnh và tương tác từng trang | Đã triển khai |
| P-D · Sửa hồi quy, đo và duyệt hình ảnh | Đã thực hiện, có các giới hạn bên dưới |
| Chromium, Firefox, WebKit | 8/8 suite mỗi engine, 450 ca mỗi engine |
| Hiệu năng CI | Qua cổng cùng môi trường với baseline 89c2154 |
| Browser Review | Thành công |
| GitHub Pages và Vercel | Đã triển khai từ bản merge |
| Thiết bị vật lý | Chưa có kết quả kiểm iPhone/Android do người dùng cung cấp trong nhật ký |

Vẫn còn số đếm detector về mục tiêu nhỏ và nghi vấn clip, điểm Lighthouse desktop accessibility 95–96. Kết quả local trước merge có hồi quy FPS mobile nhẹ, được ghi riêng môi trường trong FINAL_REPORT. Cần kiểm máy thật theo [checklist](RESPONSIVE_AUDIT.md#việc-cần-kiểm-trên-thiết-bị-thật).

[Ma trận nghiệm thu](https://github.com/FynisFL/SafeKid_Web_Demo_Prototype/actions/runs/44545138560) · [Browser Review](https://github.com/FynisFL/SafeKid_Web_Demo_Prototype/actions/runs/44545138451) · [Triển khai](https://github.com/FynisFL/SafeKid_Web_Demo_Prototype/actions/runs/44646141073) · [Báo cáo chi tiết](FINAL_REPORT.md) · [Hướng dẫn mã nguồn](../CodeGuideline.md)
