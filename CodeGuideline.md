# Hướng dẫn mã nguồn SafeKid

Cập nhật ngày 20/11/2026 theo bản phát hành `f92098d` trên `main`. Nội dung mô tả mã nguồn đã triển khai và quy ước bảo trì. Trạng thái kiểm thử và giới hạn nằm trong [báo cáo nghiệm thu](reports/FINAL_REPORT.md).

## 1. Cấu trúc thư mục

```text
.
├── .github/workflows/          # Kiểm thử và triển khai
├── public/                     # Favicon, ảnh chia sẻ, hình game, giấy phép
├── reports/                    # Báo cáo đánh giá, kế hoạch và kết quả QA
├── src/
│   ├── assets/                 # Ảnh edition và logo được Vite xử lý
│   ├── components/
│   │   ├── about/              # TeamStory của trang About
│   │   ├── app-experience/     # Sân khấu Parent App, kịch bản và tải APK
│   │   ├── easter-egg/         # LittleDetourGame, tải trễ từ footer
│   │   ├── error-boundary/     # Giao diện lỗi và thử lại route
│   │   ├── home/               # Các phần của Home và ZodiacStage dùng chung
│   │   ├── motion/             # Token, cờ, khả năng chạy motion
│   │   │   └── reactbits/      # Các thành phần React Bits điều chỉnh
│   │   ├── passport/           # PassportDemo, CoreLayers, hành trình vòng đời
│   │   ├── preloader/          # FirstSceneGate và trạng thái cảnh đầu
│   │   ├── shop/               # Giỏ hàng, giá và phương thức thanh toán mẫu
│   │   ├── site/               # Layout, header, footer, tìm edition
│   │   └── ui/                 # Thành phần giao diện nền tảng Radix
│   ├── data/                   # Zodiac, Passport, tài nguyên cảnh đầu
│   ├── hooks/                  # useLocalChat, usePageTitle, media query
│   ├── integrations/           # Tích hợp Supabase hiện hữu
│   ├── lib/                    # Breakpoint, tiện ích và ghi nhận lỗi
│   ├── pages/                  # Trang ứng với route
│   ├── main.tsx                # Khởi chạy React, analytics và Error Boundary
│   ├── App.tsx                 # Router, FirstSceneGate và ShoppingBagProvider
│   ├── router.tsx              # Khai báo route và tải trang trễ
│   ├── setup.ts                # Thiết lập khởi chạy
│   ├── analytics.ts            # Khởi tạo phân tích hiện hữu
│   └── index.css               # Style, safe-area và animation dùng chung
├── supabase/                   # Cấu hình Supabase hiện hữu
├── tests/                      # Playwright, axe, Lighthouse và đo CDP
│   └── package.json            # Dependency QA riêng
├── index.html                  # Metadata, font, noscript và điểm gắn React
├── package.json
├── package-lock.json
├── vite.config.ts
└── tailwind.config.ts
```

Cây trên liệt kê những nhóm có vai trò bảo trì chính. Danh sách tệp thực tế tra bằng `rg --files src tests public`.

## 2. Khởi chạy và xử lý lỗi

`main.tsx` nhập `setup.ts`, khởi tạo analytics, nạp CSS và gắn React tại `#root`. Error Boundary cấp ứng dụng dùng `ErrorFallback` cùng `reportCaughtError`. Trong `App.tsx`, `MotionConfig` và `FirstSceneGate` bao quanh `RouterProvider`. Route gốc tạo `ShoppingBagProvider`, `Suspense`, `Outlet` và thông báo khi trang đã gắn.

Giữ Error Boundary và tiền tố log `ErrorBoundary caught a runtime error:` để cơ chế ghi nhận lỗi hiện có hoạt động. Lỗi route dùng `src/components/error-boundary/route-error-boundary.tsx`. Khi người dùng thử lại Product hoặc Zodiac trong production, trang đọc `route-chunks.json`, xác thực lại chunk bị lỗi rồi tải lại tài liệu. Vite sinh manifest này từ chính build, hai request chỉ chạy khi bấm thử lại và dùng chung timeout 4 giây.

## 3. Bản đồ đường dẫn

Nguồn khai báo là [src/router.tsx](src/router.tsx).

| Đường dẫn | Tệp trong src/pages | Vai trò |
|---|---|---|
| `/` | Home.tsx | Giới thiệu và các cảnh tương tác |
| `/zodiac` | Zodiac.tsx | Bộ sưu tập 12 edition |
| `/product/:id` | Product.tsx | Chi tiết edition, xem ảnh và thêm giỏ |
| `/watch-passport` | WatchPassport.tsx | Hồ sơ và vòng đời mẫu |
| `/watchpassport` | Chuyển hướng | Giữ search/hash khi chuyển về đường dẫn chuẩn |
| `/app` | AppExperience.tsx | Parent App, Web App và tải APK |
| `/about` | About.tsx | Đội ngũ và hành trình dự án |
| `/support` | Support.tsx | FAQ và hướng dẫn |
| `/contact` | Contact.tsx | Mở bản nháp email |
| `/chat`, `/s-f-ai` | Chat.tsx | Hội thoại kịch bản cục bộ |
| `/sos` | Sos.tsx | Nhấn giữ hoặc kéo để mô phỏng SOS |
| `/cart`, `/checkout` | ShoppingBag.tsx | Giỏ và thanh toán xem trước |
| `*` | NotFound.tsx | Trang không tìm thấy |

Các trang tải trễ. Product và Zodiac dùng hàm `lazy` của route, kèm `handle.retryChunk` để tra manifest thử lại. Những trang còn lại dùng `React.lazy`. Khi thêm trang, đăng ký ở router và kiểm cơ chế báo sẵn sàng, lỗi và URL trực tiếp. Vite sinh các directory index cho những đường dẫn đã khai báo trong plugin `safekid-page-entries`, nên cần cập nhật danh sách này nếu thêm đường dẫn cần truy cập trực tiếp trên GitHub Pages.

## 4. Home và bộ sưu tập

Home ghép theo thứ tự `Hero` → `StorySequence` → `Thesis` → `ProductChapters` → `ParentAppSection` → `WatchPassportSection` → `ZodiacStage` → `SOSIntroduction` → `Closing`.

`ZodiacStage.tsx` dùng chung giữa Home và Zodiac. Dữ liệu sản phẩm lấy từ `src/data/zodiac.ts`. `src/components/site/collectionVisit.ts` hỗ trợ khôi phục lựa chọn và vị trí cuộn khi quay lại từ Product. Giữ liên kết `#collection`, các nút đổi mẫu, dải edition và Orbit Images đồng bộ cùng lựa chọn. Orbit có 5 ảnh trên điện thoại, 12 ảnh trên tablet/desktop.

Thanh tiến độ trang nằm ở `ScrollProgress.tsx`. Tín hiệu trang trí nằm trong từng cảnh. Closing có khiên SVG, các điểm hội tụ và hai xung CSS cục bộ. Nội dung và CTA vẫn là HTML có ngữ nghĩa.

## 5. Giỏ hàng, Contact và Chat

`src/components/shop/shoppingBag.ts` khai báo giá `WATCH_PRICE_VND = 1_450_000`, giới hạn mỗi edition 99 chiếc và định dạng VND. `ShoppingBagProvider.tsx` đọc/ghi khóa localStorage `safekid.shopping-bag.v1`, kiểm ID edition và số lượng. Khi storage bị chặn, trạng thái vẫn dùng được trong lượt mở.

`AddToBag.tsx`, `PaymentPreview.tsx` và `paymentMethods.ts` phục vụ luồng xem trước. Thông báo xác nhận giữ trạng thái chưa mở bán. Contact chỉ tạo URI mailto sau native validation. Slide Commit dùng cùng hành động với nút mở bản nháp. `src/hooks/useLocalChat.ts` quản lý kịch bản, timer, dừng phản hồi, reset và chuyển tiếp hỗ trợ mẫu.

## 6. Parent App và Watch Passport

`AppExperience.tsx` ghép `SignalStage.tsx`, kịch bản trong `scenes.ts` và `AndroidDownload.tsx`. Sân khấu nhận pointer capture để xác định vuốt ngang, giữ nút chọn kịch bản và phát lại. Trang liên kết sang Web App thuộc repo Parent App riêng. Khi sửa trang này, kiểm cả bàn phím, vuốt, tải APK và nhãn demo.

Passport gồm `PassportDemo.tsx`, `CoreLayers.tsx`, `LivesSection.tsx`, `CircularJourney.tsx`, `PrivacyTrust.tsx` và `useSectionProgress.ts` trong `components/passport/`. Nội dung mẫu nằm tại `src/data/watchPassport.ts`. Giữ nhãn `Interactive Concept Demo` và dữ liệu mẫu. Teaser ở Home dành chỗ theo chương cao nhất để tránh đẩy Zodiac khi đổi chương.

## 7. Chuyển động và responsive

Nguồn chuẩn của đường cong, thời lượng, khoảng dịch và spring là `src/components/motion/tokens.ts`. Tái dùng token khi mở rộng. Các cờ trong `setPieces.ts` gồm `animatedContent`, `scrollText`, `pageSignatures`, `heroSignal`, `zodiacOrbit`, `slideCommit`, `closingShield`, hiện đều bật.

`useEnhancedMotion.ts` theo dõi reduced motion, Save-Data nơi trình duyệt cung cấp và tab ẩn. `HeroSignal.tsx` có giới hạn DPR ≤2, số hạt 88/56/32 theo khả năng máy, giảm chất lượng theo FPS và dừng ngoài viewport. Canvas tải sau khi Hero sẵn sàng, có Suspense và Error Boundary cục bộ. Cần dọn listener, observer và RAF khi unmount.

`components/motion/reactbits/` chứa AnimatedContent, ScrollFloat, ScrollReveal, OrbitImages, SlideCommit, CountUp, GradualBlur và hook useSceneEntrance. Click Spark và Spotlight Card nằm trong nhóm app-experience. Giữ ghi nguồn và giấy phép `public/licenses/react-bits.txt`. Chi tiết tại [bảng tích hợp](reports/REACTBITS_SELECTION.md).

`src/lib/breakpoints.ts` dùng chung với Tailwind và JS, gồm 390, 480, 640, 768, 1024, 1280, 1440, 1536px. Ngưỡng chiều cao cảnh ghim là 650px, Parent App giữ media query riêng từ 961px. `useIsMobile` dùng ngưỡng dưới 768px. Safe-area lấy từ `--safe-top/right/bottom/left`. Khung đọc dùng svh, vùng làm việc cần thích ứng thanh địa chỉ dùng dvh với dự phòng vh. Kiểm chữ nhập từ 16px, mục tiêu chạm 44–48px và focus khi thay đổi layout.

## 8. Loader, SEO và ngôn ngữ

`FirstSceneGate.tsx` chọn ảnh mở đầu theo `src/data/firstScene.ts`. Sau 350ms, overlay chỉ xuất hiện nếu route hoặc ảnh còn đợi. Font chờ tối đa 160ms, sau đó dùng fallback ổn định cho lượt mở. HTML ghi lỗi stylesheet ngay khi xảy ra. Cache ấm bỏ intro, Skip xuất hiện sau 1,8 giây và timeout cứng là 8 giây. Không giữ thêm màn 100% bằng timer.

Metadata chia sẻ nằm trong `index.html`, tiêu đề/mô tả từng trang dùng `usePageTitle.ts`. URL ảnh OG/Twitter cần tuyệt đối và kích thước đúng ảnh. Giữ thẻ script cùng chú thích nền tảng hiện hữu trong HTML. Giao diện hiện dùng tiếng Anh, repository chưa có hệ thống locale. Tài liệu bảo trì viết tiếng Việt, tên API và đường dẫn giữ nguyên.

## 9. Kiểm thử và triển khai

```bash
npm ci
npm run check
npm run build
npm run preview
```

CI dùng Node.js 22 và Python 3.12. `check` gồm ESLint và TypeScript, `build` tạo dist. Để chạy QA browser trong môi trường đủ quyền và mạng, cài dependency QA riêng rồi cài browser theo cùng phiên bản.

```bash
python -m pip install playwright==1.62.0
npm --prefix tests install --package-lock=false
npm --prefix tests exec -- playwright install --with-deps chromium firefox webkit
```

Giữ preview chạy khi chạy test. Ví dụ tại terminal khác.

```bash
SAFEKID_BROWSER=chromium python tests/motion_smoke.py
SAFEKID_BROWSER=firefox python tests/scene_regressions.py
SAFEKID_BROWSER=webkit python tests/reading_layout.py
```

Tám suite hiện hành là motion_smoke, responsive_review, collection_navigation, connected_scenes, first_scene, reading_layout, device_regressions và scene_regressions. Firefox smoke vô hiệu trình xử lý mailto bên ngoài của browser headless để hộp mở email không nuốt click ở ca kế tiếp.

| Tệp QA | Vai trò |
|---|---|
| `tests/device_matrix.mjs` | 25 route × 18 viewport mỗi engine, ảnh, mục tiêu chạm, CTA, xoay và axe |
| `tests/device_performance.mjs` | Đo baseline/ứng viên cùng browser bằng CDP, 3 hồ sơ × 5 lượt lạnh và cuộn CPU 4× |
| `tests/device_lighthouse.mjs` | Lighthouse mobile/desktop cho 5 trang |
| `tests/scene_visual.mjs` | Ảnh trước/sau ở 390, 768, 1440 và 844×390 |

Đo hiệu năng dùng hai server production, manifest build và biến SAFEKID_BASELINE_URL, SAFEKID_BASE_URL, SAFEKID_BASELINE_DIST, SAFEKID_CANDIDATE_DIST. Xem job performance của workflow để chạy cùng cấu hình. Chỉ so số liệu trong cùng môi trường.

`browser-review.yml` chạy tập đại diện trên PR, khi gọi trực tiếp và khi deploy. `device-matrix.yml` chạy toàn ma trận trên PR có thay đổi thuộc phạm vi và workflow_dispatch, các job không hủy nhau khi có push mới. `deploy.yml` chạy khi push main hoặc workflow_dispatch, yêu cầu browser review qua trước deploy GitHub Pages. Vercel cũng có trạng thái triển khai gắn commit.

## 10. Quy ước bảo trì

- Đặt component theo tính năng, hook có tiền tố use, trang đăng ký trong router. Tái dùng logic hiện hữu và giữ tệp dễ đọc.
- Khi thay đổi cấu trúc, cập nhật tài liệu này và README nếu luồng sử dụng thay đổi.
- Giữ ranh giới demo, dữ liệu mẫu và phản hồi xác nhận rõ ràng.
- Kiểm reduced motion, keyboard, touch, URL trực tiếp và Back khi đổi UI.
- Supabase và analytics có tích hợp hiện hữu. Mọi thay đổi vào đó cần nằm trong phạm vi nhiệm vụ được giao.
- Các báo cáo REVIEW, PROPOSAL và nhật ký giữ mốc lịch sử. Trạng thái mới nhất đọc tại PROGRESS và phần đầu FINAL_REPORT.
