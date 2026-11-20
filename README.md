<p align="center">
  <img
    src="src/assets/safekid/logo.webp"
    alt="SafeKid Logo"
    height="110"
  />
  <img
    src="src/assets/digibabi/logo-digibabi.webp"
    alt="Logo DigiBabi"
    height="110"
  />
</p>

<h1 align="center">SafeKid x DigiBabi</h1>

<h3 align="center">The Space Between Them</h3>

<p align="center">
  Ý tưởng đồng hồ thông minh dành cho trẻ em do DigiBabi phát triển.
  <br />
  Thêm không gian trưởng thành, thêm cách giữ kết nối.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Motion-12-FFFFFF?logo=framer&logoColor=black" />
  <img src="https://img.shields.io/badge/Deployment-GitHub%20Pages-222222?logo=github" />
</p>

<p align="center">
  <a href="https://digibabi.id.vn">Website</a>
  ·
  <a href="https://github.com/FynisFL/SafeKid_Web_Demo_Prototype">Repository</a>
  ·
  <a href="./CodeGuideline.md">Hướng dẫn mã nguồn</a>
</p>


# SafeKid - The Space Between Them

**SafeKid** là dự án sản phẩm công nghệ do đội ngũ **DigiBabi** phát triển, với ý tưởng kết hợp đồng hồ thông minh dành cho trẻ em và trải nghiệm kết nối dành cho phụ huynh.

Dự án hướng đến việc tạo thêm không gian để trẻ tự do khám phá, đồng thời giúp phụ huynh an tâm hơn trong quá trình trưởng thành của con.

[**Website**](https://digibabi.id.vn)
·
[**Repository**](https://github.com/FynisFL/SafeKid_Web_Demo_Prototype)
·
**<a href="https://www.facebook.com/DigiBabi">
    Facebook
</a>**

---

## 1. Giới thiệu sản phẩm

SafeKid được xây dựng xoay quanh 6 nhóm tính năng thiết kế:

- Real-Time GPS Tracking — Định vị thời gian thực.
- Two-Way Calling — Liên lạc hai chiều.
- One-Touch SOS — Tương tác yêu cầu trợ giúp.
- Safe Zone Alerts — Cảnh báo vùng an toàn.
- Habit & Reward — Hình thành thói quen và khen thưởng.
- Battery — Định hướng tối ưu thời lượng sử dụng.

<h2 align="center">Khám phá bộ sưu tập SafeKid</h2>

<p align="center">
  <img src="src/assets/safekid/editions/rat.webp" width="24%" />
  <img src="src/assets/safekid/editions/cat.webp" width="24%" />
  <img src="src/assets/safekid/editions/dragon.webp" width="24%" />
  <img src="src/assets/safekid/editions/tiger.webp" width="24%" />
</p>

### Trải nghiệm trên website

- **Zodiac Collection:** Bộ sưu tập 12 phiên bản đồng hồ lấy cảm hứng từ 12 con giáp Việt Nam.
- **Watch Passport:** Hồ sơ thiết bị mẫu, hành trình vòng đời và sơ đồ Core/Skin/Skill.
- **SOS Demo:** Mô phỏng thao tác nhấn giữ nút SOS.
- **S.F AI:** Trợ lý theo kịch bản cục bộ và luồng chuyển tiếp hỗ trợ mô phỏng.
- **A Little Detour:** Mini game Easter Egg ẩn trên website.

> **Lưu ý:** SafeKid hiện là dự án concept và prototype. Các tính năng định vị, gọi điện, cảnh báo và kết nối thiết bị chưa hoạt động như dịch vụ thực tế. SOS chỉ là mô phỏng cục bộ, không gửi cảnh báo hay liên hệ dịch vụ khẩn cấp.

## Mã nguồn và chức năng hiện hành

Tài liệu được đối chiếu ngày 20/11/2026 với bản phát hành `f92098d`, hợp nhất từ PR #10. Giao diện website dùng tiếng Anh, tài liệu bảo trì dùng tiếng Việt. [Trạng thái phát hành](reports/PROGRESS.md).

- Bộ sưu tập dùng chung `ZodiacStage` tại Home và Zodiac. Chọn phiên bản qua nút, dải mẫu hoặc Orbit Images, rồi mở Product. Quay lại bộ sưu tập khôi phục lựa chọn và vị trí cuộn.
- Giá minh họa là 1.450.000 đồng mỗi đồng hồ, khai báo tại `src/components/shop/shoppingBag.ts`. Product → giỏ hàng → thanh toán là luồng xem trước. Giỏ lưu trong trình duyệt, bước xác nhận hiển thị thông báo chưa mở bán.
- `/app` giới thiệu Parent App, có sân khấu tín hiệu, liên kết Web App và hộp tải APK Android. Mã nguồn Parent App thuộc [repo riêng](https://github.com/FynisFL/SafeKid-Parent-App-).
- `/contact` mở bản nháp email. `/chat` và `/s-f-ai` dùng cùng trang Chat với kịch bản cục bộ. Watch Passport dùng dữ liệu mẫu, SOS mô phỏng thao tác nhấn giữ hoặc kéo xác nhận.
- Chuyển động dùng Motion, CSS, SVG, Canvas 2D và các thành phần React Bits điều chỉnh. Cờ bật/tắt nằm ở `src/components/motion/setPieces.ts`. Canvas Hero tải sau cảnh đầu và có giới hạn chất lượng.

## Chạy dự án

Cài Node.js 22 như CI, rồi chạy các lệnh tại thư mục gốc.

```bash
npm ci
npm run dev
npm run check
npm run build
npm run preview
```

`npm run check` chạy ESLint và TypeScript. `npm run build` tạo `dist/`. Kiểm thử trình duyệt dùng preview production và các tệp trong `tests/`. Hướng dẫn cấu trúc, route, lệnh QA và triển khai nằm trong [CodeGuideline.md](CodeGuideline.md).

## Tra cứu tài liệu

| Tài liệu | Mục đích |
|---|---|
| [CodeGuideline.md](CodeGuideline.md) | Cấu trúc mã nguồn và hướng dẫn bảo trì hiện hành |
| [PROGRESS.md](reports/PROGRESS.md) | Trạng thái bản phát hành |
| [FINAL_REPORT.md](reports/FINAL_REPORT.md) | Kết quả nghiệm thu cùng số đo theo từng bản |
| [QA_LOG.md](reports/QA_LOG.md) | Nhật ký lỗi, cách sửa và kiểm chứng |
| [RESPONSIVE_AUDIT.md](reports/RESPONSIVE_AUDIT.md) | Ma trận màn hình và checklist máy thật |
| [REACTBITS_SELECTION.md](reports/REACTBITS_SELECTION.md) | Thành phần chuyển động đã tích hợp |
| [REVIEW.md](reports/REVIEW.md), [PROPOSAL.md](reports/PROPOSAL.md), [DECISION_LOG.md](reports/DECISION_LOG.md) | Cơ sở đánh giá, kế hoạch và quyết định qua các giai đoạn |

## 2. Công nghệ sử dụng

| Nhóm | Công nghệ |
|---|---|
| Frontend | React 19, TypeScript |
| Build Tool | Vite 7 |
| Routing | React Router 7 |
| Styling | Tailwind CSS |
| Animation | Motion |
| UI Components | Radix UI |
| Icons | Lucide React |
| Form & Validation | React Hook Form, Zod |
| Deployment | GitHub Pages, GitHub Actions |

Một số thư viện hỗ trợ khác gồm TanStack React Query, Recharts, Embla Carousel, Supabase JS SDK và Sonner.

## 3. AI hỗ trợ phát triển

Các công cụ và trợ lý AI được sử dụng trong quá trình nghiên cứu, thiết kế và phát triển SafeKid:

| Công cụ / AI | Vai trò |
|---|---|
| OpenAI ChatGPT | Phân tích, lập kế hoạch, hỗ trợ code và xử lý lỗi |
| Anthropic Claude | Phân tích source, đề xuất kiến trúc và cải thiện giao diện |
| GitHub Copilot | Hỗ trợ lập trình trong IDE |
| LongCat | Hỗ trợ coding và nghiên cứu kỹ thuật |

**Công cụ phát triển đi kèm:** Figma, Figma MCP, Kombai, Hermes Desktop và GitHub.

*Lưu ý: Các AI trên hỗ trợ quá trình phát triển, không phải những mô hình đang chạy trực tiếp trong website. S.F AI hiện sử dụng logic kịch bản và nhận diện từ khóa cục bộ, chưa kết nối API LLM bên ngoài.*

## 4. Đội ngũ phát triển — DigiBabi

| Thành viên | Vai trò | Phụ trách |
|---|---|---|
| **Nguyễn Trường Duy** | Leader · Co-founder · Main Developer | Phát triển, thiết kế sản phẩm, UX/UI, kiến trúc và tìm kiếm nguồn cung OEM |
| **Huỳnh Kiều Ngọc Linh** | Deputy Leader · Co-founder | Kiểm thử, nghiên cứu đối thủ, marketing, kế hoạch và tính toán chi phí |
| **Tô Đỗ Trọng Nhân** | Co-founder | Storytelling, nghiên cứu và phân tích đối thủ |
| **Nguyễn Thị Phương Uyên** | Co-founder | Nghiên cứu đối thủ, storytelling và đóng góp ý tưởng |

## 5. Định hướng dự án

SafeKid không chỉ hướng đến một thiết bị công nghệ, mà còn khám phá cách công nghệ có thể hỗ trợ sự độc lập của trẻ em và duy trì kết nối trong gia đình.

**Thêm không gian trưởng thành, thêm cách giữ kết nối.**

---

**Phát triển bởi DigiBabi**
*Dự án khởi nghiệp sinh viên về thiết kế, công nghệ và kết nối gia đình.*

---

📘 **Tài liệu kỹ thuật:** Xem [CodeGuideline.md](./CodeGuideline.md) để tìm hiểu cấu trúc source code, quy chuẩn lập trình và hướng dẫn phát triển dự án.

**Thông tin Fynis/FynisFL** [LinkBout/Fynis](https://www.linkbout.com/fynis) - thông tin liên hệ
