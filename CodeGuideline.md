# CODE GUIDELINE — SAFEKID

Tài liệu này quy định cách tổ chức source code, quản lý thư mục và phát triển tính năng trong dự án SafeKid.

**Mục tiêu:** Giúp các thành viên hiểu cấu trúc dự án, biết đặt code đúng vị trí và duy trì source code thống nhất, dễ đọc, dễ bảo trì.

---

## 1. Tổng quan cấu trúc dự án

Cấu trúc thư mục chính:

```text
project-root/
├── public/                     # Tài nguyên tĩnh
│
├── src/
│   ├── assets/                 # Hình ảnh, logo và tài nguyên
│   ├── components/             # Các thành phần giao diện dùng lại
│   │   ├── ui/                 # Button, Dialog, Card,...
│   │   ├── home/               # Component riêng của Homepage
│   │   ├── motion/             # Hiệu ứng và animation
│   │   ├── passport/           # Thành phần Watch Passport
│   │   ├── site/               # Header, Footer, Layout,...
│   │   ├── easter-egg/         # Mini game ẩn
│   │   └── error-boundary/     # Xử lý lỗi giao diện
│   │
│   ├── hooks/                  # Custom React Hooks
│   ├── lib/                    # Hàm tiện ích và xử lý dùng chung
│   ├── data/                   # Dữ liệu nội bộ của dự án
│   ├── integrations/           # Tích hợp dịch vụ bên ngoài
│   ├── pages/                  # Các trang của website
│   ├── App.tsx                 # Thiết lập Router và lớp giao diện gốc
│   ├── router.tsx              # Khai báo và quản lý các tuyến đường
│   ├── main.tsx                # Điểm khởi chạy ứng dụng
│   ├── setup.ts                # Các thiết lập cần chạy trước ứng dụng
│   └── index.css               # CSS toàn cục
│
├── package.json                # Thông tin và thư viện dự án
├── CodeGuideline.md            # Tài liệu quy chuẩn lập trình
├── vite.config.ts              # Cấu hình Vite
├── tailwind.config.ts          # Cấu hình Tailwind CSS
└── ...
```

*Lưu ý: Đây là cấu trúc định hướng. Một số thư mục có thể được mở rộng khi dự án phát triển.*

## 2. Chức năng của từng thư mục

| Thư mục | Chức năng |
|---|---|
| `public/` | Chứa tài nguyên tĩnh được sử dụng trực tiếp như icon, hình nền, file SVG và các file public khác. |
| `src/assets/` | Chứa hình ảnh, logo và tài nguyên được import vào source code. |
| `src/components/` | Chứa các thành phần giao diện có thể tái sử dụng. |
| `src/hooks/` | Chứa các React Hook tự xây dựng để quản lý trạng thái và logic. |
| `src/lib/` | Chứa các hàm tiện ích, xử lý dữ liệu và logic dùng chung. |
| `src/data/` | Chứa dữ liệu nội bộ như thông tin sản phẩm, bộ sưu tập và nội dung demo. |
| `src/integrations/` | Chứa code kết nối với các dịch vụ bên ngoài. |
| `src/pages/` | Chứa các trang chính tương ứng với từng đường dẫn website. |

### Các nhóm component quan trọng

Trong `src/components/`, nên phân chia theo chức năng:

- `ui/`: Những thành phần giao diện cơ bản như Button, Card, Dialog, Input.
- `home/`: Các section và component chỉ phục vụ trang chủ.
- `motion/`: Các hiệu ứng chuyển động, parallax, scroll và animation.
- `passport/`: Những thành phần thuộc tính năng Watch Passport.
- `site/`: Header, Footer, Layout và các thành phần dùng chung giữa nhiều trang.
- `easter-egg/`: Các tính năng ẩn, mini game và tương tác đặc biệt.
- `error-boundary/`: Các thành phần hiển thị giao diện dự phòng khi ứng dụng gặp lỗi.

**Nguyên tắc:** Code nên được đặt theo chức năng. Không gom tất cả component vào một thư mục nếu chúng thuộc những tính năng khác nhau.

---

## 3. Quy tắc khi thêm code mới

### 3.1. Thêm một trang mới

Mỗi trang website cần được đăng ký trong `src/router.tsx`.

Đối với trang đơn giản, có thể tạo file trực tiếp trong `src/pages/`, tương tự các trang hiện tại.

Đối với trang có nhiều component hoặc logic riêng, nên tạo một thư mục riêng để quản lý.

Ví dụ:

```text
src/
└── pages/
    └── profile/
        ├── index.tsx
        ├── ProfileHeader.tsx
        └── ProfileDetails.tsx
```

Sau khi tạo trang, đăng ký route trong `src/router.tsx`:

```tsx
import Profile from "./pages/profile";

// Thêm vào danh sách routers
{
  path: "/profile",
  name: "profile",
  element: <Profile />
}
```

Trong đó:

- `path`: Đường dẫn mà người dùng truy cập.
- `name`: Tên định danh của route.
- `element`: Component hiển thị tương ứng.

### 3.2. Thêm component mới

- Nếu component được sử dụng ở nhiều trang, đặt trong `src/components/`.
- Nếu chỉ phục vụ một trang, ưu tiên đặt gần trang đó.
- Nếu có nhiều component thuộc cùng một tính năng, tạo thư mục riêng.
- Mỗi component nên đảm nhiệm một nhiệm vụ cụ thể.
- Ưu tiên code ngắn gọn, dễ đọc và dễ tái sử dụng.

Ví dụ:

```text
components/
└── product/
    ├── ProductCard.tsx
    ├── ProductGallery.tsx
    └── ProductDetails.tsx
```

### 3.3. Thêm React Hook

Tạo file trong `src/hooks/`, tên file nên bắt đầu bằng `use`.

Ví dụ:

```text
src/hooks/
├── useLocalChat.ts
├── usePageTitle.ts
└── useFeature.ts
```

Mỗi Hook nên tập trung giải quyết một nhiệm vụ, tránh gom quá nhiều logic không liên quan vào cùng một file.

### 3.4. Thêm hàm tiện ích

Các hàm xử lý dữ liệu hoặc logic không thuộc component và Hook nên được đặt trong `src/lib/`.

Ví dụ:

```text
src/lib/
├── utils.ts
├── report-caught-error.ts
└── helpers/
```

Không nên đặt các hàm tiện ích vào component nếu chúng có thể được sử dụng ở nhiều nơi.

---

## 4. Quy tắc tổ chức và viết code

### 4.1. Mỗi file có một nhiệm vụ chính

Không nên viết một component đảm nhiệm quá nhiều công việc.

Khi một file phát triển quá lớn, hãy xem xét tách thành các component, Hook hoặc utility riêng.

Khuyến khích giữ các component đơn giản dưới 100 dòng khi phù hợp, nhưng không cần ép buộc nếu việc tách nhỏ khiến code khó hiểu hơn.

### 4.2. Quy tắc đặt tên

| Thành phần | Quy tắc | Ví dụ |
|---|---|---|
| React Component | PascalCase | `ProductCard.tsx` |
| Page Component | PascalCase | `Home.tsx` |
| Hook | camelCase, bắt đầu bằng `use` | `useLocalChat.ts` |
| Utility | camelCase | `formatDate.ts` |
| Biến và hàm | camelCase | `handleSubmit` |
| Hằng số | UPPER_SNAKE_CASE | `HOLD_DURATION` |
| Route | lowercase, dùng dấu gạch ngang khi cần | `/watch-passport` |

### 4.3. Tính liên kết và khả năng bảo trì

- Hạn chế phụ thuộc không cần thiết giữa các component.
- Chỉ chia sẻ code khi thực sự cần tái sử dụng.
- Không tạo nhiều file trùng chức năng.
- Không xóa code đang được sử dụng nếu chưa kiểm tra các nơi import.
- Ưu tiên sử dụng thư viện đã có trong dự án trước khi cài thư viện mới.

### 4.4. Chú thích code

Nên thêm comment khi xử lý logic phức tạp, animation đặc biệt hoặc những phần code không dễ hiểu ngay từ đầu.

Comment cần giải thích **vì sao đoạn code được viết như vậy**, thay vì chỉ diễn giải lại từng dòng code.

---

## 5. Hỗ trợ đa ngôn ngữ

Dự án không cài đặt sẵn hệ thống đa ngôn ngữ.

Khi cần hỗ trợ nhiều ngôn ngữ:

- Không tự ý cài thêm `i18next`.
- Không tự tạo các file locale hoặc hệ thống `src/i18n/` riêng.
- Cần sử dụng quy trình tích hợp i18n của nền tảng Enter thông qua công cụ `i18n_enable` và skill `enter_i18n`.

Điều này giúp tránh xung đột giữa hệ thống dịch tự xây dựng và cấu hình nền tảng hiện tại.

---

## 6. SEO và thông tin chia sẻ website

Các thông tin metadata chính của website được quản lý trong phần `<head>` của `index.html`.

Khi thay đổi tiêu đề hoặc mô tả trang, cần kiểm tra và cập nhật đồng bộ:

- `<title>`
- `meta name="description"`
- `og:title`
- `og:description`
- `og:image`
- `og:image:alt`
- `twitter:title`
- `twitter:description`
- `twitter:image`

### Lưu ý về hình ảnh chia sẻ

- URL của `og:image` và `twitter:image` phải là URL tuyệt đối.
- Nếu thay ảnh đại diện chia sẻ, cần cập nhật cả hai thẻ.
- Duy trì đúng kích thước khai báo `og:image:width` và `og:image:height`.
- Ưu tiên hình ảnh đại diện phù hợp với nhận diện SafeKid.

---

## 7. Xử lý lỗi và Error Boundary

SafeKid sử dụng Error Boundary để hạn chế việc một trang hoặc component gặp lỗi làm ảnh hưởng toàn bộ website.

**Các quy tắc bắt buộc:**

- Không tự ý xóa hoặc vô hiệu hóa Error Boundary.
- `src/main.tsx` chứa lớp Error Boundary cấp ứng dụng và cơ chế báo cáo lỗi.
- `src/App.tsx` thiết lập route gốc và Error Boundary dùng chung cho các trang.
- Route mới phải được thêm vào `src/router.tsx` để kế thừa cơ chế xử lý lỗi này.

Các file liên quan:

```text
src/
├── main.tsx
├── App.tsx
├── router.tsx
├── components/
│   └── error-boundary/
│       ├── error-fallback.tsx
│       └── route-error-boundary.tsx
└── lib/
    └── report-caught-error.ts
```

Không thay đổi tiền tố log:

```text
ErrorBoundary caught a runtime error:
```

Tiền tố này được nền tảng Enter sử dụng để nhận diện lỗi runtime.

Nếu chỉ muốn cô lập lỗi trong một khu vực giao diện, có thể sử dụng `ErrorBoundary` từ `react-error-boundary` cùng `FallbackComponent={ErrorFallback}`.

---

## 8. Các module đặc thù của SafeKid

Đây là những module đã được phát triển riêng cho dự án. Khi chỉnh sửa, cần kiểm tra các component liên quan để tránh làm hỏng những tính năng hiện có.

### 8.1. Watch Passport

Watch Passport là tính năng trải nghiệm tương tác giới thiệu sản phẩm, không phải hệ thống quản lý thiết bị thực tế.

Các file chính:

```text
src/
├── pages/
│   └── WatchPassport.tsx
│
├── components/
│   ├── passport/
│   │   ├── PassportDemo
│   │   ├── LivesSection
│   │   ├── CircularJourney
│   │   ├── PrivacyTrust
│   │   └── useSectionProgress
│   │
│   └── home/
│       └── WatchPassportSection.tsx
│
└── data/
    └── watchPassport.ts
```

**Nguyên tắc:**

- Chỉ sử dụng dữ liệu mẫu cục bộ.
- Không tự ý thêm dữ liệu cá nhân hoặc thông tin thiết bị thật.
- Duy trì nhãn `Interactive Concept Demo`.
- Giữ nguyên trải nghiệm tương tác và cấu trúc chuyển động khi chỉnh sửa.

### 8.2. Motion System

SafeKid sử dụng bộ quy chuẩn chuyển động chung để các hiệu ứng trên website có cảm giác đồng nhất.

File quan trọng:

```text
src/components/motion/tokens.ts
```

File này quản lý:

- `EASE`: Đường cong chuyển động.
- `DURATION`: Thời lượng animation.
- `DISTANCE`: Khoảng cách di chuyển của phần tử.
- `SCROLL_SPRING`: Thông số làm mượt chuyển động theo cuộn trang.

Các thành phần như Reveal, Stagger, Hero và Watch Passport sử dụng những thông số này.

**Nguyên tắc khi chỉnh sửa Motion:**

- Ưu tiên sử dụng motion token có sẵn.
- Không tự tạo nhiều hệ thống easing và duration trùng lặp.
- Giữ trải nghiệm nhất quán giữa desktop và mobile.
- Luôn chú ý đến `prefers-reduced-motion`.
- Kiểm tra lại scroll, touch và keyboard sau khi thay đổi hiệu ứng.

---

## 9. Quy định cập nhật tài liệu

Đây là quy định quan trọng đối với tất cả thành viên.

Mỗi khi thêm, xóa hoặc thay đổi một module có ảnh hưởng đến cấu trúc dự án, cần cập nhật lại file `CodeGuideline.md`.

Các trường hợp cần cập nhật:

- Thêm hoặc xóa một trang mới.
- Tạo thêm thư mục component.
- Thêm Hook hoặc utility mới có vai trò quan trọng.
- Bổ sung một hệ thống hoặc tính năng lớn.
- Thay đổi cách tổ chức source code.
- Thêm thư viện hoặc công nghệ có ảnh hưởng đến kiến trúc.

Tài liệu cần phản ánh đúng cấu trúc thực tế của repository, không giữ lại những module đã bị xóa hoặc không còn sử dụng.

**Không xem CodeGuideline.md là tài liệu viết một lần rồi bỏ quên. Đây là tài liệu được cập nhật xuyên suốt quá trình phát triển SafeKid.**

---

## 10. Checklist trước khi hoàn thành công việc

Trước khi commit hoặc bàn giao một thay đổi, hãy kiểm tra:

- [ ] Code được đặt đúng thư mục.
- [ ] Tên file, component và Hook đúng quy tắc.
- [ ] Không tạo code trùng chức năng.
- [ ] Không làm hỏng các route hiện có.
- [ ] Không vô tình xóa Error Boundary.
- [ ] Không ảnh hưởng đến responsive và trải nghiệm mobile.
- [ ] Đã kiểm tra reduced-motion nếu có animation.
- [ ] Đã cập nhật CodeGuideline.md nếu cấu trúc dự án thay đổi.
- [ ] Đã chạy kiểm tra phù hợp trước khi bàn giao.

**Nguyên tắc cuối cùng:**

> Viết code để người khác có thể đọc, hiểu, tiếp tục phát triển và bảo trì — không chỉ để chương trình chạy được.

---

*SafeKid — Developed by DigiBabi.*
