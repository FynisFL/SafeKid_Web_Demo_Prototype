# SafeKid — Hướng dẫn sử dụng và phân phối tài nguyên


**Project Lead:** FynisFL  
**Role:** Leader & Co-Founder of DigiBabi

Repository này lưu source code, tài nguyên thiết kế và các tài liệu triển khai của website demo SafeKid. README tập trung vào công cụ hỗ trợ, cách sử dụng dự án và nguyên tắc phân phối tài nguyên.

## 1. Phần mềm và công cụ hỗ trợ

### AI

- LongCat Preview 2.5
- Step 3.7 Flash
- Laguna S 2.1
- Nemotron 3 Ultra
- Inkling
- GPT 6 Luna
- GPT Terra 5.5
- Claude Sonnet 5.5

### AI Builder

- [Enter Pro](https://enter.pro/) — hỗ trợ xây dựng, chỉnh sửa và publish ứng dụng bằng prompt; dự án có thể đồng bộ với GitHub.

## 2. Cách sử dụng dự án

### Xem mã nguồn

1. Mở repository GitHub của SafeKid.
2. Chọn **Code → Download ZIP** để tải source code, hoặc clone repository nếu đã cài Git.
3. Giải nén ZIP trước khi thao tác với các tệp trong dự án.

### Chạy dự án trên máy tính

Yêu cầu: Node.js và npm đã được cài đặt.

```bash
# Cài đặt dependencies
npm ci

# Chạy môi trường phát triển
npm run dev

# Tạo bản build
npm run build
```

Nếu dự án đang được quản lý bằng Enter Pro hoặc một công cụ khác, ưu tiên sử dụng package manager và hướng dẫn tương ứng trong cấu hình hiện tại của repository. Không trộn nhiều package manager hoặc tự ý xóa lockfile.

### Chỉnh sửa và cập nhật

- Khi làm việc bằng Enter Pro, mở đúng project đã liên kết với repository và kiểm tra thay đổi trước khi publish.
- Khi làm việc trực tiếp với source, chỉnh sửa trên bản làm việc riêng; kiểm tra build trước khi đưa thay đổi lên nhánh chính.
- Không ghi đè source hiện có chỉ để thêm tài liệu hoặc tài nguyên mới.
- Không thêm, gỡ hoặc nâng cấp dependency nếu chưa xác định rõ nhu cầu và tác động.

## 3. Phân phối tài nguyên

### Tài nguyên trong repository

| Vị trí | Nội dung |
|---|---|
| `src/` | Mã nguồn ứng dụng, các trang, component, logic và style |
| `src/assets/` | Hình ảnh và tài nguyên được import trực tiếp vào mã nguồn |
| `public/` | Tài nguyên tĩnh được phục vụ trực tiếp |
| `src/data/` | Dữ liệu dùng trong giao diện, chẳng hạn dữ liệu Zodiac |
| `CodeGuideline.md` | Hướng dẫn và quy ước code của dự án |
| `EXPLANATION_GAPS.md` | Các điểm còn thiếu hoặc cần xác minh trong tài liệu/dự án |

Tên thư mục hoặc nội dung có thể thay đổi theo phiên bản source; hãy kiểm tra cấu trúc thực tế trước khi chỉnh sửa.

### Nguyên tắc chia sẻ

- Chia sẻ link repository để người khác truy cập source code.
- Chia sẻ link website đã publish riêng với link repository; hai loại link có mục đích khác nhau.
- Khi gửi tài nguyên cho thành viên khác, ghi rõ tên phiên bản, ngày cập nhật và những tệp đã thay đổi.
- Giữ nguyên cấu trúc thư mục khi đóng gói ZIP để tránh mất liên kết giữa mã nguồn và hình ảnh.
- Không đưa API key, access token, mật khẩu hoặc thông tin bí mật vào repository công khai. Dùng `.env` cục bộ và chỉ chia sẻ tệp mẫu như `.env.example`.
- Chỉ phân phối hình ảnh, font, thư viện và tài liệu khi có quyền sử dụng hoặc chia sẻ phù hợp.

### Cập nhật lên GitHub

1. Kiểm tra các tệp thay đổi và loại bỏ thông tin bí mật.
2. Chạy `npm run build` nếu môi trường hỗ trợ.
3. Đưa các thay đổi cần thiết lên repository.
4. Kiểm tra trạng thái GitHub Actions/Pages hoặc nền tảng hosting đang sử dụng.
5. Mở link website đã publish và kiểm tra hình ảnh, điều hướng, animation trên desktop và mobile.

## 4. Lưu ý

- Đây là dự án demo. Các tính năng mô phỏng không nên được mô tả như dịch vụ an toàn hoặc định vị đang hoạt động thực tế.
- Không coi việc upload source lên GitHub là bằng chứng website đã được publish thành công.
- Nếu website trắng hoặc lỗi, kiểm tra build log, Console và Network trước khi sửa code.
