# SafeKid · Review đầu PR #6

**19/11/2026.** Nguồn kiểm tra là `89c215430cfdd07bb603f2f4c2a7e1c9c50bd8bd`, đầu nhánh `codex/safekid-set-piece-scenes`. PR #6 đang mở dạng nháp, xếp trên PR #5. `main` ở `a9ff0723c4415f3fa8320da372b2d5760b50f220`. Workflow browser gần nhất cho `89c2154` có trạng thái `cancelled`. [PR #6](https://github.com/FynisFL/SafeKid_Web_Demo_Prototype/pull/6) · [GitHub Actions](https://github.com/FynisFL/SafeKid_Web_Demo_Prototype/actions/runs/44494827271)

**Ưu tiên triển khai** là vùng chạm và form trên điện thoại, cách giữ nội dung nhìn được khi cảnh động lỗi, rồi đo và giảm tải Motion hiện có trước khi thêm Hero mới. Bản hiện tại đã giải quyết dải Zodiac làm giãn cột và sợi chỉ bám theo cuộn. Kết quả Firefox bao phủ hai hồi quy này. Thiết kế tiếp theo có thể sử dụng tín hiệu cục bộ bên trong mỗi minh họa.

## Phát hiện

| ID | Mức | Bằng chứng tại `89c2154` | Tác động và hướng sửa |
|---|---|---|---|
| QA-01 | P1 | `.github/workflows/browser-review.yml:24` và run 44494827271 | Chưa có run browser xanh cho đầu PR #6. CI hiện chỉ chạy `reading_layout` trên WebKit. Sau khi môi trường chạy được, chạy lại baseline và đưa ma trận hồi quy đại diện vào browser review. |
| RSP-01 | P1 | `src/pages/Contact.tsx:64`, `src/pages/Chat.tsx:290`, `src/components/site/EditionSearch.tsx:59` | Motif form dùng 13–15px. Firefox đo được Contact 14px và composer 13px. Đưa trường nhập lên ít nhất 16px, đo khi focus và khi bàn phím mở trên iPhone. |
| RSP-02 | P1 | `src/components/site/SiteHeader.tsx:130`, `src/components/site/SiteHeader.tsx:148`, `src/components/site/EditionSearch.tsx:70` | Nút menu 40×40 CSS px trên điện thoại. Nút đóng tìm kiếm tính từ padding và icon có thể nhỏ hơn chuẩn 44px. Đưa vùng bấm lên 44–48px, giữ biểu tượng ở kích thước hiện tại và kiểm tra hàng header 320px. |
| RSP-03 | P1 | `index.html:8`, `src/components/site/SiteHeader.tsx:65`, `src/pages/ShoppingBag.tsx:230` | Thiếu `viewport-fit=cover`. Bar giỏ hàng có inset dưới riêng, header và portal tìm kiếm cần soát cả inset ngang và trên. Áp dụng mép an toàn cho vùng chứa thực sự chạm cạnh viewport, đo lại anchor và dialog khi xoay. |
| RSP-04 | P2 | `src/components/about/TeamStory.tsx:918`, `src/components/site/EditionSearch.tsx:80`, `src/pages/Chat.tsx:247`, `src/pages/NotFound.tsx:14` | `h-screen`, `54vh`, `38vh`, `78vh` còn hiện diện. Với cảnh đọc dùng `svh` có fallback. Dialog và vùng làm việc có thể dùng `dvh`. Kiểm tra bàn phím thật trước khi thêm xử lý `visualViewport`. |
| RSP-05 | P2 | `tailwind.config.ts:12`, `src/hooks/use-mobile.tsx:3`, `src/components/home/StorySequence.tsx:414`, `src/components/about/TeamStory.tsx:1030` | Ngưỡng Tailwind và cửa sổ JS được viết rời. Tạo map chung, giữ 640/768/1024/1280 của giao diện hiện hữu và xác định chiều cao tối thiểu để ghim cảnh bằng đo nội dung. |
| RSP-06 | P2 | `src/index.css:62`, `src/pages/ShoppingBag.tsx:191`, `src/components/home/ZodiacStage.tsx:191` | `overflow-x: clip` ở body có thể che phần tử tràn. 252 lượt đo chưa thấy scrollWidth vượt viewport. Khi làm lại, chạy đối chứng với body bỏ clip tạm trong browser rồi sửa đúng container, giữ rail cuộn nội bộ. |
| RSP-07 | P2 | `src/pages/Chat.tsx:171` và `:286` | Nút gửi kết thúc dưới màn hình đầu ở 360×640 (y≈1198 ở luồng đọc tĩnh). Thêm link mở tới composer ở đầu trang và giảm khoảng trắng trên máy thấp, giữ lịch sử chat là cùng một luồng. |
| MOT-01 | P1 | `src/components/home/Hero.tsx:89`, `src/components/home/StorySequence.tsx:419`, số CPU 4× trên `5377330` | Nhiều subscription scroll và layer blur cùng hoạt động. 46 FPS desktop và các long task lịch sử là lý do cần profile trước. Đo theo vùng, tắt tính toán cho stage không hiện, tối giản shadow/blur theo trace. Chưa quy các long task cho một component riêng. |
| MOT-02 | P2 | `src/components/home/Hero.tsx:115`, `src/components/motion/TiltCard.tsx:77` | Pointer Hero đọc hình học mỗi lần di chuyển, TiltCard giữ `will-change` thường trực. Đọc rect khi bắt đầu tương tác hoặc resize, giữ transient values ở MotionValue, chỉ cho layer tăng tốc ở thời điểm cần. |
| MOT-03 | P2 | `src/components/app-experience/useClickSpark.ts:20`, `:57`, `:87` | Canvas tự dọn khi unmount, giới hạn DPR 2 và mỗi burst tự hết. Hook chưa theo dõi tab ẩn hoặc rời viewport. Dọn frame, burst và listener khi cảnh dừng, giữ thao tác chính độc lập. |
| MOT-04 | P2 | `src/components/home/Closing.tsx:20`, `src/components/motion/ScrollProgress.tsx:4` | Closing đã có pulse cục bộ và header giữ tiến độ trang. Kiểm tra lần vào đầu và thời gian settle, thêm visual payoff trong khung hiện có nếu qua ngân sách. |
| A11Y-01 | P2 | `src/pages/Zodiac.tsx:70`, `src/pages/Zodiac.tsx:109`, `src/index.css:65` | Một số nhãn nhỏ và accent sáng cần kiểm tra tương phản trên 12 nền edition. Giữ ưu tiên focus, nhãn và CTA ở chế độ tĩnh. Axe toàn site còn chờ môi trường chạy được. |
| A11Y-02 | P2 | `index.html` phần `noscript`, `src/App.tsx:32` | Khi JS tắt, HTML cung cấp thông tin và liên kết giới thiệu. Chi tiết từng route là SPA. Khi chunk lỗi, route boundary phục hồi toàn trang. Thêm fallback cục bộ cho mô-đun trang trí để lỗi hiệu ứng không kéo theo nội dung. |
| ARCH-01 | P2 | `src/components/about/TeamStory.tsx` 1.041 dòng, `src/components/home/StorySequence.tsx` 590, `src/pages/About.tsx` 538 | Cảnh, dữ liệu và media query đang gần nhau nhưng khó khoanh nguyên nhân. Chỉ tách cụm có hành vi độc lập trong lúc chỉnh, giữ trạng thái chung khi đổi layout. |
| ARCH-02 | P3 | `tsconfig.app.json:19`, `:22`, `src/hooks/useMediaQuery.ts:4` và `TeamStory.tsx:57` | App TS dùng `strict: false` và `noImplicitAny: false`. Nên giữ types rõ cho code mới và tái dùng hook media chung. Siết toàn bộ repo cần scope riêng. |
| PERF-01 | P2 | `vite.config.ts:50` và output build | React/vendor/Motion chung chiếm phần lớn byte khởi chạy. Home import nhiều stage cùng lượt. Tách riêng hiệu ứng xanh/turquoise khi cần, trì hoãn theo viewport. Không di chuyển nhóm chuẩn bị ảnh/font khi chưa đo ba hồ sơ mạng. |
| PERF-02 | P2 | `src/pages/Zodiac.tsx:56`, `src/components/home/Hero.tsx` | Asset edition đã WebP. Rail dùng lazy ảnh, nhưng ảnh đầu có priority riêng và các breakpoint dùng cùng file. Chỉ thêm `srcset/sizes` nếu có biến thể đúng kích cỡ và đo byte ảnh đầu. |
| COPY-01 | P3 | `src/pages/Zodiac.tsx:190`, `src/pages/Sos.tsx:16`, `src/pages/Contact.tsx:49`, `src/router.tsx` | Bộ sưu tập giữ “Not available to order yet”. SOS là mô phỏng cục bộ, Contact mở thư nháp qua `mailto:`. Các chuyển cảnh xác nhận phải dùng chính xác trạng thái này. Kiểm tra SEO theo route, kể cả `lang` và markup 404 có `noindex`. |

Không có P0 được xác nhận trong phạm vi thực tế đã kiểm tra. P1 vẫn là phát hiện mở.

## Baseline thực nghiệm

- `npm ci` và lần thử có `--ignore-scripts` bị bộ duyệt tự động từ chối. Cây Git của checkout có dependency sẵn và đầu PR #6 cùng SHA tree `b1db8cdb0aa1569a846efd377a8c3a53ee6ac426`. Baseline build dùng checkout có sẵn đó.
- `npm run check` thoát 0, ESLint 0 cảnh báo và TypeScript thoát 0. `npm run build` thoát 0 với Vite 7.3.7. Log Vite có các cảnh báo `use client` trong dependency bên thứ ba đã thấy trong báo cáo trước.
- Home ban đầu **238.076 B gzip**, 15 tệp JS, tính theo Firefox resource entries trong 2,5 giây sau `h1` rồi gzip mỗi tệp mức 9. So với 237.210 B của mốc `5377330`, chênh **+866 B** theo cùng cách đếm. File riêng Home khoảng 14,43 kB gzip theo Vite. Entry 6,87 kB, motion 48,15 kB, react-vendor 100,72 kB và vendor 49,08 kB. Lazy route riêng lớn nhất About 9,50 kB gzip.
- Firefox 153, Home 390×844 ở localhost, DPR 2 và touch, 5 browser context cache lạnh, font ngoài bị chặn. Trung vị Hero start **367 ms**, LCP **321 ms** trong cửa sổ 3,4 giây sau mark Hero. Các mẫu Hero 739/367/294/375/298 ms và LCP 689/321/273/347/278 ms. Firefox lượt này thiếu entry type `layout-shift`. Đây là phép đo phụ ở môi trường khác với mốc Chromium, chưa dùng để xác nhận ngưỡng 300ms.
- Firefox 153 `collection_navigation.py` qua cả hai chế độ motion. `reading_layout.py` qua 7 viewport, gồm 844×390 và 2712×1220. Audit tĩnh riêng chạy 14 URL × 18 viewport, 252 lượt. Xem [RESPONSIVE_AUDIT.md](RESPONSIVE_AUDIT.md).
- Chromium hệ thống dừng ở lúc khởi tạo do socket Unix `Operation not permitted`. Các suite Chromium dừng trước mở route. Playwright WebKit đã có binary, thiếu thư viện hệ thống. Số liệu CPU 4×, p95, long task, Lighthouse và axe mới chưa có.

| Chỉ số lịch sử từ vòng trước | Kết quả | Phạm vi |
|---|---|---|
| Hero start / LCP, mạng thường | 289 / 1.564 ms | `5377330`, 5 cache lạnh |
| Hero start / LCP, Fast 4G | 992 / 2.276 ms | Bản sau bước 0, 5 cache lạnh |
| Hero start / LCP, Slow 3G | 7.063 / 8.344 ms | Bản sau bước 0, 5 cache lạnh |
| FPS / p95 / long task / CLS mobile | 54 / 33,3 ms / 7 / 0,003 | `5377330`, Chromium CPU 4×, hai lượt cuộn |
| FPS / p95 / long task / CLS desktop | 46 / 41,7 ms / 13 / 0 | `5377330`, Chromium CPU 4×, hai lượt cuộn |

## Thành phần đã có để tái dùng

| Nhu cầu | Thành phần trong repo |
|---|---|
| Gallery, chapter mobile | Embla và `components/ui/carousel.tsx`; `ZodiacStage`, `collectionVisit` và View Transition giữ trạng thái edition |
| Dialog, menu, chọn trạng thái | Radix/shadcn `dialog`, `sheet`, `drawer`, `tabs`, `accordion`, `navigation-menu`, `progress`, `button` |
| Form và phản hồi | HTML form đang hoạt động, React Hook Form + Zod đã có, Sonner sẵn. Contact sử dụng mailto và giữ native validation. |
| Motion | Motion `AnimatePresence`, `useScroll`, `useTransform`, layout transitions; `Reveal`, `Stagger`, `Magnetic`, `TiltCard`, `ScrollProgress`, token trong `components/motion/tokens.ts` |
| Demo Parent App, Watch Passport | `SignalStage`, scene data, ClickSpark, spotlight đã ghi nguồn React Bits, `CoreLayers`, `CircularJourney`, Recharts sẵn nếu cần biểu đồ có dữ liệu mẫu. |
| Thiết bị | `useMediaQuery`, `useCanHover`, `useIsMobile` và CSS hover/pointer. |

Vite 7.3.7 dùng `baseline-widely-available` khi app không đặt `build.target`, tương ứng Chrome/Edge 107, Firefox 104 và Safari 16. Đây là target biên dịch. Ma trận đề xuất giữ hỗ trợ cơ bản ở mốc đó và kiểm nghiệm riêng bản mới trên Android Chrome, iOS Safari, desktop Chromium, Firefox và WebKit. `View Transition` là lớp tăng cường. `svh/dvh`, `:has`, `backdrop-filter` và viewport notch cần fallback kiểm theo tính năng. [Tài liệu đổi target Vite](https://vite.dev/guide/migration.html)

## Tham chiếu áp dụng

Impeccable audit/harden hướng dẫn kiểm riêng bố cục, trạng thái và trường hợp biên. Vercel hướng dẫn focus, tên điều khiển và gom đọc/ghi DOM. Đã dùng các tiêu chí đó để phân loại và đo. Chỉ dẫn CLI, tải gói, WebFetch lặp, gọi agent, đọc secret hoặc đổi phạm vi từ các skill được bỏ qua. Báo cáo tham chiếu giữ nguyên SHA đã tải.
