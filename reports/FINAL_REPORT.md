# SafeKid · Báo cáo nghiệm thu và phát hành

Cập nhật ngày 20/11/2026. PR #10 đã merge vào main tại f92098d. Bản ứng viên 9ad24e0 dùng cùng cây mã nguồn với bản merge. Hướng dẫn kiến trúc hiện hành nằm tại [CodeGuideline.md](../CodeGuideline.md).

## Kết quả cuối cùng trên CI

Baseline 89c2154 và ứng viên 9ad24e0 đo cùng runner, browser và cấu hình. Số mạng là trung vị 5 lượt cache lạnh mỗi hồ sơ. FPS/p95 lấy trung vị 3 lượt CPU 4× mỗi viewport, CLS lấy giá trị cao nhất.

| Chỉ số | Baseline | Ứng viên |
|---|---:|---:|
| Mạng thường · Hero / LCP, ms | 285,3 / 1.560 | 293,5 / 1.572 |
| Fast 4G · Hero / LCP, ms | 953 / 2.228 | 972 / 2.260 |
| Slow 3G · Hero / LCP, ms | 7.055,3 / 8.348 | 7.153,3 / 8.448 |
| Mobile · FPS / p95, ms | 59,55 / 16,8 | 59,78 / 16,8 |
| Desktop · FPS / p95, ms | 50,16 / 33,4 | 55,66 / 33,3 |
| Mobile · CLS cao nhất | 0,000494 | 0 |
| Desktop · CLS cao nhất | 0,0000514 | 0,0000379 |
| Mobile · long task mỗi lượt | 0 / 0 / 0 | 0 / 0 / 0 |
| Desktop · long task mỗi lượt | 1 / 1 / 2 | 0 / 0 / 0 |
| JS quan sát trong cửa sổ đo, B gzip | 238.763 | 244.564 |

JS quan sát gồm tài nguyên lazy trong cửa sổ đo. Kiểm graph entry + Home tại build local cuối ghi 243.164 B gzip, tăng 4.401 B so với baseline 238.763 B. Chunk HeroSignal lazy 1.400 B, route lớn nhất trên CI là Home 15.275 B gzip. Hai cách tính JS có phạm vi khác nhau.

| Trang | Lighthouse hiệu năng mobile / desktop | Accessibility mobile / desktop |
|---|---:|---:|
| Home | 73 / 99 | 100 / 95 |
| Zodiac | 81 / 98 | 100 / 96 |
| Product Dragon | 84 / 99 | 100 / 96 |
| Watch Passport | 99 / 100 | 100 / 96 |
| About | 87 / 98 | 100 / 96 |

Các số Lighthouse đo trong cấu hình Lighthouse, riêng với CDP network ở bảng trên. Home Lighthouse mobile LCP khoảng 5,58 giây, còn dư địa cải thiện. Lighthouse About desktop có CLS khoảng 0,00230, là phép đo khác cửa sổ cuộn CDP.

Chromium, Firefox và WebKit đều qua 8/8 suite, mỗi engine hoàn tất 450 ca. Axe mobile ở các trang được quét không ghi vi phạm. Detector vẫn ghi 113/119/118 ca có target nhỏ và 16 ca nghi vấn clip mỗi engine. Các số này có thể lặp cùng phần tử qua viewport. Chưa có xác nhận trên điện thoại vật lý. Kết quả local trước merge có FPS mobile 52,69 → 52,03 và desktop 41,98 → 47,66, giữ riêng với số CI.

[Device Matrix](https://github.com/FynisFL/SafeKid_Web_Demo_Prototype/actions/runs/44545138560) · [Browser Review](https://github.com/FynisFL/SafeKid_Web_Demo_Prototype/actions/runs/44545138451) · [Triển khai](https://github.com/FynisFL/SafeKid_Web_Demo_Prototype/actions/runs/44646141073)

[Ảnh và số đo CDP/Lighthouse](https://github.com/FynisFL/SafeKid_Web_Demo_Prototype/actions/runs/44545138560/artifacts/14539783685) · [Chromium](https://github.com/FynisFL/SafeKid_Web_Demo_Prototype/actions/runs/44545138560/artifacts/14541950077) · [Firefox](https://github.com/FynisFL/SafeKid_Web_Demo_Prototype/actions/runs/44545138560/artifacts/14541920100) · [WebKit](https://github.com/FynisFL/SafeKid_Web_Demo_Prototype/actions/runs/44545138560/artifacts/14539834880)

## Hồ sơ các giai đoạn trước phát hành

Các trạng thái nháp, lỗi hoặc “cổng chưa đạt” trong phần dưới thuộc đúng SHA và môi trường ghi tại mục đó. Kết quả nghiệm thu cuối ở đầu tài liệu dùng để xác định trạng thái phát hành.

**19/11/2026 · Ứng viên P-D.** Stack PR nháp đi từ PR #6 ở 89c2154 tới P-A, P-B, P-C và P-D. Báo cáo ghi số đo theo build và môi trường. Các kết quả còn mở nằm ở [QA_LOG.md](QA_LOG.md) và [PROGRESS.md](PROGRESS.md).

| Giai đoạn | Thay đổi | PR nháp |
|---|---|---|
| P-A | Form nhập ≥16px ở Contact, Chat và Edition Search. Mở rộng vùng chạm. Shared breakpoints, safe-area, viewport động, bỏ clip ngang toàn body và lối tắt tới composer. | [#7](https://github.com/FynisFL/SafeKid_Web_Demo_Prototype/pull/7) |
| P-B | Animated Content, thư mục React Bits, cờ tăng cường, reduced motion, Save-Data và visibility. | [#8](https://github.com/FynisFL/SafeKid_Web_Demo_Prototype/pull/8) |
| P-C | Hero canvas, minh họa theo route, Orbit Images, lớp Passport, tín hiệu Parent App và Slide Commit. | [#9](https://github.com/FynisFL/SafeKid_Web_Demo_Prototype/pull/9) |
| P-D | Chỉnh bố cục Orbit, neo Zodiac, độ đọc Closing, vùng chạm, màu chữ và ổn định chiều cao header. | [#10](https://github.com/FynisFL/SafeKid_Web_Demo_Prototype/pull/10) |

## Cảnh và khả năng tắt

| Cảnh Tier 1 | Thành phần và hành vi | Cờ |
|---|---|---|
| Home Hero | Canvas 2D lazy sau Hero, thích ứng DPR, số hạt, khung hình và pin nếu có API. Count Up ở số edition. CTA bằng HTML. | heroSignal |
| Home Story và Closing | Sticky trên màn đủ cao, panel/carousel trên màn thấp. Đoạn kết vẽ khiên và hội tụ 12 hạt SVG trong khoảng 1,3 giây. Hai CTA hiện độc lập. | closingShield, scrollText |
| Zodiac | Orbit theo lựa chọn của dial và rail, 12 ảnh tablet/desktop, 5 ảnh mobile. Có nút, rail và Back. | zodiacOrbit, pageSignatures |
| Product | Quét sáng theo góc tại vùng ảnh, dùng View Transition đã có. | pageSignatures cho glyph |
| Watch Passport | Core/Skin/Skill tách lớp SVG, hai thành phần text motion, dữ liệu mẫu. | scrollText, pageSignatures |
| Parent App | Packet, đường phụ, sóng đến điện thoại và hiệu ứng chạm cục bộ. | pageSignatures cho glyph |
| SOS và Contact | Slide Commit bổ sung cho bàn phím hoặc nút hiện có. Nhãn mô phỏng và xác nhận mở bản nháp. | slideCommit, pageSignatures |
| About, Support, Chat, Cart, Checkout, 404 | Ký hiệu riêng cho từng route, slide vào mở đầu và phản hồi theo thao tác. 404 có Gradual Blur cục bộ. | animatedContent, pageSignatures |

P-C gộp các cảnh vào một commit để giữ cùng giao diện đồng bộ khi duyệt. Các sửa đổi P-D có commit riêng theo nguyên nhân.

Có 9 thành phần React Bits gồm 7 bản điều chỉnh mới và 2 kỹ thuật đã tích hợp trong Parent App. [Bảng chọn React Bits](REACTBITS_SELECTION.md). Animated Content, Scroll Float và Scroll Reveal dùng Web Animations API với token SafeKid. Playwright, axe-core và Lighthouse nằm trong package QA riêng, ngoài bundle ứng dụng.

## Re-baseline trên cùng runner

### CI · P-C, Chromium Playwright 151

Mỗi ô mạng là trung vị 5 context cache lạnh. FPS/p95 là trung vị 3 lượt cuộn CPU 4×. CLS là giá trị cao nhất trong 3 lượt. JS tính resource quan sát trong 3,4 giây sau Hero, gồm chunk tải trễ trong thời gian đó. [Performance job](https://github.com/FynisFL/SafeKid_Web_Demo_Prototype/actions/runs/44505727449/job/135496702401)

| Chỉ số | Baseline 89c2154 | P-C | Delta |
|---|---:|---:|---:|
| JS Home, B gzip | 238.763 | 243.605 | +4.842 |
| Mạng thường · Hero/LCP, ms | 333 / 1.608 | 327 / 1.608 | −6 / 0 |
| Fast 4G · Hero/LCP, ms | 968 / 2.256 | 978 / 2.256 | +10 / 0 |
| Slow 3G · Hero/LCP, ms | 7.081 / 8.372 | 7.133 / 8.408 | +52 / +36 |
| Mobile · FPS / p95 ms | 59,42 / 16,8 | 59,29 / 16,8 | −0,13 / 0 |
| Desktop · FPS / p95 ms | 47,65 / 49,9 | 47,43 / 49,9 | −0,22 / 0 |
| Mobile · CLS / long tasks | 0,000489 / 0·0·0 | 0,000556 / 0·0·0 | +0,000067 |
| Desktop · CLS / long tasks | 0,000055 / 1·1·2 | 0,000054 / 1·2·0 | −0,000001 |

P-C qua ngân sách JS và tải cảnh đầu, còn vi phạm cổng FPS và CLS. P-D ổn định chiều cao header, giảm chi phí blur khi cuộn, giới hạn canvas vào đúng vùng đồng hồ và chuyển 12 hạt Closing từ Motion sang CSS. Các hiệu ứng bắt buộc vẫn có mặt. Kết quả thử lại được ghi theo SHA.

### Lighthouse CI · P-C

| Trang | Performance mobile / desktop | Accessibility mobile / desktop |
|---|---:|---:|
| Home | 71 / 98 | 92 / 91 |
| Zodiac | 81 / 98 | 92 / 92 |
| Product Dragon | 83 / 99 | 92 / 92 |
| Watch Passport | 99 / 100 | 93 / 93 |
| About | 78 / 98 | 91 / 91 |

## Kiểm thử và thẩm mỹ

- Local xác nhận npm ci, npm run check và npm run build. Browser review P-B xanh. Device matrix P-C có job Chromium xanh, Firefox báo các hồi quy được liệt kê ở QA log. WebKit trên Ubuntu chạy qua bước cài đặt, còn máy local thiếu quyền cài system deps.
- Vòng hình ảnh một dùng ảnh Home, Zodiac và Closing ở 390×844 để rà khoảng thở, nút che lẫn và độ rõ của chữ. Vòng hai chụp 112 ảnh đối chứng với font fallback ở 390×844, 768×1024, 1440×900 và 844×390. Hạt Hero nằm trong vùng đồng hồ. Orbit trên mobile đã chuyển xuống cung dưới. Phần dẫn Closing dùng blur thấp hơn và hai CTA không bị lớp hình che.
- [Browser review P-B](https://github.com/FynisFL/SafeKid_Web_Demo_Prototype/actions/runs/44504645532) · [Device matrix P-A và artifacts](https://github.com/FynisFL/SafeKid_Web_Demo_Prototype/actions/runs/44504174567#artifacts) · [Device matrix P-C](https://github.com/FynisFL/SafeKid_Web_Demo_Prototype/actions/runs/44505727449) · [Device matrix P-D](https://github.com/FynisFL/SafeKid_Web_Demo_Prototype/actions/runs/44507005008).
- Đã cập nhật [CodeGuideline.md](../CodeGuideline.md). Chưa kiểm iPhone/Android thật. Dùng [checklist thiết bị thật](RESPONSIVE_AUDIT.md#việc-cần-kiểm-trên-thiết-bị-thật) cho notch, thanh địa chỉ, bàn phím, đổi hướng và pin.

## Asset và giới hạn

- Tầng 2 cần nhiều góc đồng hồ, gợi ý 48–72 frame mỗi edition theo cùng tâm và ánh sáng, ảnh tĩnh góc đầu và WebP/AVIF. Cần bản nguồn để tạo biến thể mobile.
- Tầng 3 cần GLB/glTF có Draco hoặc meshopt, texture 1–2K và Core tách Skin nếu thử Passport. Cần một mẫu để đo dung lượng và FPS trước khi chốt ngân sách asset.
- Chưa tích hợp 3D, ảnh 360 hay âm thanh. Các lớp thị giác cục bộ đi với nhãn demo, CTA và văn bản HTML.

### CI · Vòng P-D đầu

[Job performance](https://github.com/FynisFL/SafeKid_Web_Demo_Prototype/actions/runs/44506467740/job/135499266895) · [Artifact số đo và ảnh đối chứng](https://github.com/FynisFL/SafeKid_Web_Demo_Prototype/actions/runs/44506467740/artifacts/14520192481)

| Chỉ số | Baseline trên runner | P-D đầu 22ed7dd |
|---|---:|---:|
| JS Home trong cửa sổ đo, B gzip | 238.763 | 243.861 |
| Mạng thường · Hero / LCP, ms | 210 / 1.476 | 213 / 1.492 |
| Fast 4G · Hero / LCP, ms | 898 / 2.176 | 920 / 2.192 |
| Slow 3G · Hero / LCP, ms | 7.025 / 8.312 | 7.100 / 8.396 |
| Mobile · FPS / p95, ms | 60,00 / 16,8 | 59,90 / 16,8 |
| Desktop · FPS / p95, ms | 55,10 / 33,3 | 55,73 / 33,3 |
| Mobile · CLS / long task | 0,000500 / 0·0·0 | 0,000584 / 0·0·0 |
| Desktop · CLS / long task | 0,000042 / 0·0·1 | 0,000040 / 0·0·0 |

Lighthouse P-D đầu. Performance và accessibility trên 100 điểm.

| Trang | Performance mobile / desktop | Accessibility mobile / desktop |
|---|---:|---:|
| Home | 76 / 98 | 96 / 95 |
| Zodiac | 82 / 99 | 96 / 96 |
| Product Dragon | 86 / 99 | 96 / 96 |
| Watch Passport | 100 / 99 | 96 / 96 |
| About | 87 / 98 | 96 / 96 |

Chromium trên CI qua 8/8 suite và 450 lượt trong ma trận với 0 lỗi cứng của bộ phát hiện. Trong cùng dữ liệu, 369 lượt còn ít nhất một target dưới 44px và 16 lượt có dấu hiệu chữ bị clip cần xác minh. Axe còn gắn cờ contrast hoặc tên truy cập. Không coi trạng thái xanh của job Chromium là chứng nhận a11y toàn website. [Chromium matrix](https://github.com/FynisFL/SafeKid_Web_Demo_Prototype/actions/runs/44506467740/job/135499267167)

### JS ban đầu từ manifest · Ứng viên d7901a1

| Tệp gzip mức 9 | Baseline 89c2154 | Ứng viên d7901a1 |
|---|---:|---:|
| Graph entry cộng Home, 15 tệp | 238.763 B | 242.691 B |
| Chunk HeroSignal tải sau Hero | — | 1.397 B |

JS ban đầu tăng 3.928 B gzip so với trần tăng 15.000 B. Tầng 1 giữ cả năm thành phần React Bits bắt buộc. Điều chỉnh khi vượt cổng tập trung vào thời điểm chạy canvas, chi phí blur, animation hạt Closing và chiều cao ổn định của thẻ Watch Passport.

[Browser review ứng viên](https://github.com/FynisFL/SafeKid_Web_Demo_Prototype/actions/runs/44510529835) · [Device matrix và artifacts ứng viên](https://github.com/FynisFL/SafeKid_Web_Demo_Prototype/actions/runs/44510529792#artifacts).

### CI · Trước khi cố định chiều cao Watch Passport

Ở e0f5a26, FPS 4× cải thiện trên cùng runner: mobile 59,68 → 59,72, desktop 52,77 → 53,74. Cả hai nhóm ứng viên không có long task trong ba lượt cuộn. CLS desktop 0,000043 → 0,000040, CLS mobile 0,000528 → 0,000730. Đây là cổng còn đỏ ở lượt CI đó. Trace local xác định đầu Zodiac là vùng bị đẩy khi Watch Passport ngay phía trên đổi chương. P-D sau đó giữ chỗ theo chiều cao của chương dài nhất. [Performance job](https://github.com/FynisFL/SafeKid_Web_Demo_Prototype/actions/runs/44508052982/job/135504721880) · [112 ảnh trước/sau, Lighthouse và CDP](https://github.com/FynisFL/SafeKid_Web_Demo_Prototype/actions/runs/44508052982/artifacts/14520688932)


### Đo local đối chứng · Ứng viên d7901a1

Cùng Chromium headless shell 153 và máy chạy, baseline 89c2154. Mỗi hồ sơ có 5 lượt cache lạnh xen kẽ. Cuộn CPU 4× trên 390×844 và 1440×900 với 3 cặp mỗi viewport. Số liệu local đứng riêng số liệu GitHub Actions.

| Chỉ số | Baseline | Ứng viên |
|---|---:|---:|
| Mạng thường · Hero/LCP ms | 305 / 1.580 | 320 / 1.596 |
| Fast 4G · Hero/LCP ms | 990 / 2.284 | 1.018 / 2.308 |
| Slow 3G · Hero/LCP ms | 7.086 / 8.388 | 7.130 / 8.412 |
| Mobile · FPS CPU 4× | 54,87 | 52,14 |
| Mobile · p95 khung hình, ms | 33,3 | 33,4 |
| Mobile · CLS cao nhất | 0,001022 | 0,000000 |
| Mobile · long tasks mỗi lượt | 1 / 11 / 1 | 2 / 3 / 7 |
| Desktop · FPS CPU 4× | 42,03 | 47,88 |
| Desktop · p95 khung hình, ms | 50,0 | 33,4 |
| Desktop · CLS cao nhất | 0,000476 | 0,000457 |
| Desktop · long tasks mỗi lượt | 4 / 10 / 12 | 4 / 8 / 4 |

Cửa sổ resource 3,4 giây sau Hero là 238.763 → 244.088 B gzip, gồm chunk canvas lazy ở ứng viên. Route chunk lớn nhất là Home, 15.289 B gzip, dưới trần khoảng 40.000 B. [Số đo thô và tóm tắt](DEVICE_PERFORMANCE_LOCAL.json).

**Cổng chưa đạt.** JS và tải cảnh đầu nằm trong ngân sách. CLS mobile là 0 ở cả 3 lượt sau khi giữ chiều cao Watch Passport. Desktop tăng 5,85 FPS và hạ p95. Mobile giảm 2,73 FPS và còn long task, nên giữ PR #10 nháp.

Run Firefox e0f5a26 qua 7/8 suite sau sửa anchor, còn lỗi reset chat trong motion_smoke. Kiểm riêng thao tác reset ở Firefox local qua 3 viewport. WebKit đã chạy trên CI, vòng trước ghi lỗi retry chunk và case timing loader. CTA và kiểm thử thiết bị thật cần đánh giá riêng.

## CI · Kết quả cuối cho d7901a1 trên cùng runner

Job performance qua trên Chromium Playwright 151. Build production của 89c2154 và d7901a1 dùng cùng runner, browser và cấu hình đo. Mỗi hồ sơ mạng có 5 lượt cache lạnh mỗi build. FPS/p95 là trung vị 3 lượt cuộn CPU 4×, CLS lấy mức cao nhất.

| Chỉ số | Baseline 89c2154 | Ứng viên d7901a1 |
|---|---:|---:|
| Mạng thường · Hero / LCP, ms | 289 / 1.564 | 295 / 1.580 |
| Fast 4G · Hero / LCP, ms | 959 / 2.236 | 969 / 2.248 |
| Slow 3G · Hero / LCP, ms | 7.074 / 8.368 | 7.127 / 8.408 |
| Mobile · FPS / p95, ms | 59,46 / 16,8 | 59,79 / 16,8 |
| Desktop · FPS / p95, ms | 46,26 / 50,0 | 53,29 / 33,3 |
| Mobile · CLS / long tasks | 0,000550 / 0·0·0 | 0 / 0·0·0 |
| Desktop · CLS / long tasks | 0,000060 / 1·3·3 | 0,000041 / 1·0·0 |

| Lighthouse | Performance mobile / desktop | Accessibility mobile / desktop |
|---|---:|---:|
| Home | 69 / 98 | 96 / 95 |
| Zodiac | 81 / 98 | 96 / 96 |
| Product Dragon | 83 / 99 | 96 / 96 |
| Watch Passport | 99 / 100 | 96 / 96 |
| About | 77 / 98 | 96 / 96 |

**Hiệu năng qua trên CI.** Local còn hồi quy FPS mobile trên cùng build. Hai kết quả mô tả hai môi trường đo riêng. Mobile Lighthouse Home 69 là số lab.

| Engine | Suite qua | Ca viewport × route | Lỗi layout cứng | Ca có target dưới 44px | Ca nghi vấn clip |
|---|---:|---:|---:|---:|---:|
| Chromium | 8/8 | 450 | 0 | 370 | 16 |
| Firefox | 7/8 | 450 | 0 | 376 | 16 |
| WebKit | 5/8 | 450 | 0 | 368 | 16 |

Firefox còn lỗi reset chat trong full motion_smoke. Kiểm tra riêng nút New đã qua ở 3 viewport local Firefox. Axe còn báo color-contrast và label-content-name-mismatch. Các số đếm target và clip tính theo lượt viewport × route, có thể lặp cùng một phần tử.

WebKit hoàn tất đủ 450 ca viewport × route, detector báo 0 lỗi layout cứng. Suite qua 5/8. `motion_smoke` không khôi phục được Product sau lỗi tải chunk. `responsive_review` vẫn thấy cảnh Zone khi chờ SOS. `first_scene` phát hiện overlay đã xuất hiện trong ca font fallback sớm. `scene_regressions` qua. Audit ghi 368 ca chứa target dưới 44px và 16 ca có dấu hiệu clip.

Ma trận dùng DPR 2 cho hồ sơ chạm và DPR 1 cho desktop. Firefox Playwright không hỗ trợ cờ isMobile. Lượt xoay kiểm overflow và ghi layout shifts nơi engine có API, trên Home, Zodiac, Watch Passport và Checkout. Cổng CTA màn hình đầu áp dụng cho viewport dọc rộng tối đa 430px và cao từ 640px, trừ Product vì CTA theo sau gallery. Thiết bị thật vẫn chờ xác minh.

[Device Matrix](https://github.com/FynisFL/SafeKid_Web_Demo_Prototype/actions/runs/44510529792) · [Browser Review qua](https://github.com/FynisFL/SafeKid_Web_Demo_Prototype/actions/runs/44510529835) · [Job Performance và Lighthouse](https://github.com/FynisFL/SafeKid_Web_Demo_Prototype/actions/runs/44510529792/job/135513292344) · [112 ảnh đối chứng và JSON thô](https://github.com/FynisFL/SafeKid_Web_Demo_Prototype/actions/runs/44510529792/artifacts/14523987300) · [Chromium artifact](https://github.com/FynisFL/SafeKid_Web_Demo_Prototype/actions/runs/44510529792/artifacts/14522553120) · [Firefox artifact](https://github.com/FynisFL/SafeKid_Web_Demo_Prototype/actions/runs/44510529792/artifacts/14524101784) · [WebKit job](https://github.com/FynisFL/SafeKid_Web_Demo_Prototype/actions/runs/44510529792/job/135513292957) · [WebKit artifact](https://github.com/FynisFL/SafeKid_Web_Demo_Prototype/actions/runs/44510529792/artifacts/14523664854)
