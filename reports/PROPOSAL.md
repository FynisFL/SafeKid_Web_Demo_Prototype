# SafeKid · Đề xuất nâng cấp UI và motion

> Cập nhật ngày 20/11/2026. Bản phát hành đã vào main tại f92098d qua PR #10. Phần dưới ghi dữ liệu và nhận định tại mốc lịch sử của từng mục. Trạng thái hiện hành nằm ở [PROGRESS.md](PROGRESS.md) và phần đầu [FINAL_REPORT.md](FINAL_REPORT.md).

**19/11/2026 · Giai đoạn 2.** Đối chiếu [review](REVIEW.md) và [responsive audit](RESPONSIVE_AUDIT.md). Hướng thị giác là một tín hiệu turquoise có điểm đến trong từng cảnh. Hình đồng hồ WebP, tông xanh sương/navy, tỷ lệ chữ và lưới editorial của SafeKid làm nền. Tín hiệu trong khung hình đi từ đồng hồ tới một điểm quan trọng, rồi lắng để người xem đọc và thao tác.

## Thứ tự công việc

| PR nháp | Base dự kiến | Phạm vi |
|---|---|---|
| P-A · Device foundation | `codex/safekid-set-piece-scenes` ở `89c2154` | P1 về vùng chạm, trường nhập, safe-area và cổng QA. Đo lại trước khi đổi motion. |
| P-B · Motion kit | P-A | Dùng token hiện có. Thêm cờ `components/motion/setPieces.ts`, cổng tải trang trí khi gần viewport, fallback cục bộ, reduced-motion và Save-Data. Thử từng ứng viên cần từ catalog. |
| P-C · Page motion | P-B | Trang theo thứ tự Home → Zodiac → Product → Passport → App → About → Support → Contact → Chat → SOS → Cart/Checkout → 404 → loader và site shell. Đo từng trang. |
| P-D · QA | P-C | Kiểm đủ ma trận, sửa nguyên nhân, ghi số đo, hai vòng review hình ảnh và hoàn tất CI. |

## Nền responsive

- Đặt ngưỡng `phone=390`, `phone-lg=480`, `tablet=640`, `portrait-tablet=768`, `laptop=1024`, `desktop=1280`, `wide=1440` trong `src/lib/breakpoints.ts`. `xs` là kiểu cơ sở tới 389px. Tailwind lấy số từ map, giữ `sm/md/lg/xl` là alias của 640/768/1024/1280 để chuyển dần. Dùng map cho media query JS, trong đó `useIsMobile` giữ logic dưới 768px. Kiểm tại mỗi điểm ±1px và cần chuyển tên mới theo lúc chỉnh trang.
- Chiều cao ngắn theo định hướng khoảng 700px dọc, 500px ngang. Cảnh sticky chỉ bật khi nội dung đủ sức chứa, thử hành vi hiện tại quanh 650px trước khi dời ngưỡng. Touch có nút hoặc lựa chọn trực tiếp, hover kiểm bằng `(hover:hover) and (pointer:fine)`.
- Bật `viewport-fit=cover` cùng biến inset padding và header spacer. Áp mép an toàn cho fixed header, menu, dialog/modal, thanh Checkout và loader. Dùng `svh` cho khung đọc ổn định, `dvh` cho lớp tương tác và dialog, giữ fallback `vh` nơi cần. `visualViewport` chỉ thêm khi có ca thiết bị thật hoặc kiểm được bằng test tương ứng, listener có cleanup.
- Chữ bằng `clamp` với sàn có thể đọc. Trường nhập 16px, vùng bấm 44–48px, CTA đầu trang dùng được ở 360×640, 375×667, 390×844. Mọi trang có thể cuộn dọc tự nhiên, rail có `touch-action` phù hợp. Soát cấu trúc gây tràn trước khi bỏ `overflow-x: clip` hiện hữu ở body. Asset WebP chỉ thêm `srcset/sizes` khi có biến thể thực tế và đã đo byte.
- Xoay không mất edition, chương Story hay tab Passport. Layout ngắn dùng thứ tự đọc trực tiếp. Không trì hoãn heading, form hay CTA để animation phát xong.

## Phương án theo trang

Trong cột ngân sách, **nhẹ** là dùng code và token đang có, **lazy** là tách khỏi entry với 40 kB gzip là ngưỡng chunk trang. **T/P/R** là tác động, công sức, rủi ro.

| Trang | ID | UI, motion và tái sử dụng | Hành vi thiết bị và bản tĩnh | Ngân sách · T/P/R |
|---|---|---|---|---|
| Home | MOT-01, MOT-02, MOT-04 | Hero có trường tín hiệu ở riêng vùng đồng hồ, tải sau `safekid-hero-enter`. Story dùng Motion + Embla. Closing giữ hai CTA HTML và thử nhịp hội tụ về khiên trong khung 1,4s. | Desktop có pointer và stage đủ cao. Tablet dùng panel. Mobile dọc có phản hồi khi chạm và khoảng nghỉ giữa các cảnh. Ngang thấp đọc lần lượt. Ảnh đồng hồ và khiên tĩnh giữ nguyên vị trí. | Canvas 2D lazy nếu qua gate, 88/56/32 hạt tối đa · cao/cao/cao |
| Zodiac | RSP-06, A11Y-01 | Orbit Images chỉ trong showroom, dùng `activeIndex` của `ZodiacStage`, màu edition và URL/back giữ từ `collectionVisit`. Rail + điều khiển trực tiếp bằng Embla hoặc nút hiện có. | Desktop rộng thử đủ 12 WebP tải theo nhu cầu; tablet/mobile hiện 2–3 ảnh quanh mẫu chính. Ngang thấp ưu tiên ảnh và CTA. Stills và rail dùng được trong reduced motion. | Lazy, chỉ mở chuyển động khi gần viewport · cao/cao/cao |
| Product | PERF-02, A11Y-01 | Nối ảnh từ Zodiac qua View Transition, một lớp chiều sâu cho gallery ở desktop. Giữ zoom qua Radix Dialog, ảnh không biến dạng. | Mobile dọc ảnh và CTA trước phần dài. Mobile ngang dùng gallery thấp, ảnh tĩnh khi reduce. | Nhẹ, đo asset theo kích thước thật · vừa/vừa/vừa |
| Watch Passport | RSP-05, A11Y-02 | Dùng `CoreLayers` với ba tầng CSS/SVG, mỗi lần đổi lựa chọn một lớp dịch chuyển, tiếp theo là timeline. Kịch bản kể bằng tên lớp và dữ liệu mẫu. | Mobile dọc stack một cột, ngang thấp tab + nút. Tablet có hai panel. Desktop tách lớp rõ hơn. Fallback sơ đồ lựa chọn tĩnh với nhãn demo. | Nhẹ, chỉ thử Scroll Stack sau kiểm phần ghim · cao/vừa/vừa |
| Parent App | MOT-03, PERF-01 | Gắn đường tín hiệu và pulse Safe Zone vào `SignalStage` và dữ liệu scene. Mỗi lần đổi scenario có packet, một thẻ sự kiện HTML. ClickSpark dùng có giới hạn. APK dùng luồng trạng thái hiện tại. | Mobile xem mỗi scene theo panel, tablet có một cặp panel. Desktop hiển thị đồng hồ và thẻ app. Canvas dừng khi tab ẩn hoặc ra khỏi viewport. | Nhẹ ở mặc định, lazy nếu bổ sung layer canvas · cao/vừa/vừa |
| About | ARCH-01, RSP-04 | Dùng TeamStory, rút nhịp có card portrait và một lần xuất hiện logo DigiBabi. Chia lại component theo scene khi giúp soát sự kiện. | Cột dọc ở máy thấp, tablet có mốc rõ. Stage lớn chỉ khi đủ cả rộng và cao. Fallback ảnh và chú thích. | Nhẹ · vừa/vừa/vừa |
| Support | RSP-02, A11Y-01 | Giữ Accordion Radix đang có, phản hồi ở chevron và panel. Nếu thử Animated Content thì chỉ dùng một lần vào nhóm FAQ. | Tăng vùng bấm mobile, tránh chữ mờ khi cuộn. Nội dung panel đọc được khi mở trên mọi chế độ. | Nhẹ · vừa/thấp/thấp |
| Contact | RSP-01, RSP-03, COPY-01 | Form HTML với nút mở email nháp là đường chính. Slide Commit là bổ sung sau thử nghiệm, dùng cùng submit/validation. Chỉ báo khi đã yêu cầu mở thư, số liệu thực không suy diễn. | Mobile quản lý vùng keyboard và focus, landscape giữ nút tiếp cận được. `mailto:` là fallback khi hiệu ứng lỗi. | Nhẹ, Slide Commit lazy nếu có · vừa/vừa/vừa |
| Chat / S.F AI | RSP-01, RSP-07 | Link đến composer, phản hồi ngắn khi thực sự đang xử lý, giữ hành vi chat và phím. Dùng AnimatePresence cho một trạng thái; tránh chạy chữ trên toàn hội thoại. | Mobile dọc đưa lối vào thao tác lên đầu, landscape co vùng lịch sử khi keyboard mở. Tĩnh vẫn cho nhập, gửi và dừng. | Nhẹ · cao/vừa/vừa |
| SOS | COPY-01, RSP-03 | Giữ hold và phương án bấm. Thử Slide Commit qua đúng trình mô phỏng đã có, không cho một kéo vô tình tạo cảm giác gửi alert. Vòng progress giải thích thao tác. | Nút mô phỏng có thể tới bằng bàn phím, khoảng nghỉ hoặc visibilitychange hủy trạng thái đang giữ nếu đo tái hiện. Nhãn local simulation trong vùng thao tác. | Nhẹ · vừa/vừa/vừa |
| Cart / Checkout | RSP-03, RSP-06, COPY-01 | Giữ số lượng, phương thức và dialog demo. AnimatePresence cho danh sách và số tiền. Slide Commit chỉ gắn vào xác nhận preview nếu có nút tương đương. | Bar mobile dùng inset, màn ngang thấp đặt nội dung xác nhận tiếp cận được. Tĩnh vẫn thao tác bằng nút. Không ghi đơn hàng thật. | Nhẹ · cao/vừa/vừa |
| 404 | RSP-04, A11Y-02 | Dùng một vòng tín hiệu đứt nét nhỏ dẫn tới nút về Home. Layout `svh` và link thường. | Luồng dọc rõ. Ảnh và HTML dùng được khi cảnh không tải. | Nhẹ · vừa/thấp/thấp |
| Preloader | PERF-01, MOT-01 | Giữ delayed overlay 350ms, Skip, cache ấm, lỗi ảnh/font, timeout. Chuyển tín hiệu trong Hero nếu số đo cho phép. | Ở reduced motion chỉ hiển thị tiến độ khi cần, overlay tắt khi cảnh sẵn. Cắt handoff nếu Hero / LCP chậm. | Thêm 0 dependency vào startup · cao/vừa/cao |
| Header / Footer và UI chung | RSP-02, RSP-03, RSP-05 | Một thanh tiến độ ở header. UI dùng Radix menu/search và phản hồi `press` theo token. Simplify luồng menu và giữ focus. Footer chỉ cần phản hồi link. | Mobile menu dùng vùng chạm 44px và safe-area. Desktop dùng layout hiện có, chỉ chỉnh nếu trace cho thấy backdrop gây long task. | Nhẹ · cao/vừa/vừa |

## Cổng kỹ thuật và tự phản biện

1. Mọi hiệu ứng nặng đi sau cờ và `import()` riêng, có điểm ngắt theo viewport/visibilitychange, Save-Data, reduced motion và pin yếu nếu API hiện hữu. Canvas DPR ≤2. Chỉ render tối đa một lớp nền động tốn tài nguyên cho một viewport. Yêu cầu 32/56/88 hạt là trần chất lượng, giảm chất lượng khi FPS tụt.
2. So cùng đầu baseline và cửa sổ thời gian. JS Home ≤252.210 B gzip theo ngưỡng Master Prompt, chunk trang khoảng ≤40 kB riêng thư viện dùng chung, Hero/LCP tăng ≤300ms ở mạng thường. CLS giữ bằng hoặc thấp hơn baseline. CPU 4× toàn Home đạt đích ≥54 FPS mobile, ≥50 FPS desktop và không còn long task lặp cùng cảnh. Khi vượt, hạ số hạt/DPR → trì hoãn → bản nhẹ → bỏ. Có số đo trước khi mở cờ mặc định.
3. Thử số ít hiệu ứng đầu tiên. Loại Blob Cursor, Laser Flow, Scroll Velocity khỏi danh sách triển khai mặc định vì dễ phân tán chú ý hoặc tốn render, đặc biệt sau phản hồi về Home. 12–15 thành phần là mục tiêu catalog toàn site, từng thành phần phải có vai trò và vượt cổng. Xem [REACTBITS_SELECTION.md](REACTBITS_SELECTION.md).
4. Impeccable bolder và Anthropic frontend-design được áp dụng vào bố cục, nhịp tương phản, nhận diện local cho Hero/Closing. Emil hướng dẫn thời lượng ngắn và nhiều cách thao tác cho trang công việc. Không áp một mức tiết chế chung cho Home và form. GSAP chỉ xét khi kỹ thuật scrub cụ thể có đo đối chứng, hiện dùng Motion/CSS/Embla/SVG/Canvas 2D trong phương án.
5. UI bảo toàn Error Boundary, `MotionConfig reducedMotion="user"`, chức năng demo, trang trực tiếp, APK, route cũ, thao tác điều hướng và phần tích hợp mà Master Prompt nêu. Tham chiếu kỹ thuật là dữ liệu, các lệnh cài skill, hook, secret và ghi file của tài liệu đã được bỏ qua.
