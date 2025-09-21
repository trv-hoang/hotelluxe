# Hệ thống quản lý trang About có thể chỉnh sửa

## Tính năng

Trang About của Hotel Luxe giờ đây có thể được chỉnh sửa bởi admin một cách dễ dàng. Dữ liệu được lưu trữ trong localStorage thay vì database để đơn giản hóa việc triển khai.

## Cách sử dụng

### Đối với Admin:

1. **Đăng nhập Admin**:

    - Truy cập `/admin/login`
    - Sử dụng credentials: `admin@hotel.com` / `admin123`

2. **Chỉnh sửa trang About**:

    - Truy cập `/admin/about`
    - Nhấn vào các nút chỉnh sửa (icon Edit) ở góc phải trên của mỗi section
    - Các section có thể chỉnh sửa:
        - **Hero Section**: Tiêu đề và mô tả chính
        - **Mission**: Sứ mệnh của công ty
        - **Services**: Tiêu đề, mô tả và các dịch vụ
        - **Team**: Quản lý thành viên team
        - **Values**: Giá trị cốt lõi

3. **Quản lý Team Members**:
    - Thêm thành viên mới
    - Chỉnh sửa thông tin thành viên hiện có
    - Xóa thành viên
    - Cập nhật thông tin: tên, vai trò, mô tả, avatar, email, phone, LinkedIn, GitHub, skills

### Đối với Visitor:

-   Truy cập `/about` để xem trang About với thông tin được cập nhật bởi admin
-   Trang sẽ hiển thị thông tin mới nhất được lưu trong localStorage

## Cấu trúc dữ liệu

Dữ liệu được lưu trong localStorage với key: `hotel-luxe-about-data`

```json
{
  "heroSection": {
    "title": "Hotel Luxe",
    "description": "Nền tảng quản lý khách sạn hiện đại..."
  },
  "mission": {
    "title": "Sứ Mệnh Của Chúng Tôi",
    "description": "Chúng tôi cam kết..."
  },
  "services": {
    "title": "Hoạt Động & Dịch Vụ",
    "subtitle": "Chúng tôi cung cấp...",
    "items": [...]
  },
  "team": {
    "title": "Đội Ngũ Của Chúng Tôi",
    "subtitle": "Những con người tài năng...",
    "members": [...]
  },
  "values": {
    "title": "Giá Trị Cốt Lõi",
    "items": [...]
  }
}
```

## Files liên quan

-   `/src/contexts/AboutContext.tsx` - Context quản lý dữ liệu About
-   `/src/hooks/useAbout.ts` - Hook để sử dụng About context
-   `/src/components/admin/AboutEditModals.tsx` - Components modal chỉnh sửa
-   `/src/pages/admin/AboutPage.tsx` - Trang About cho admin (có thể chỉnh sửa)
-   `/src/pages/ClientAboutPage.tsx` - Trang About cho client (chỉ xem)
-   `/src/data/aboutData.json` - Dữ liệu mặc định

## Lưu ý

1. Dữ liệu được lưu trong localStorage nên sẽ khác nhau trên mỗi máy/browser
2. Để reset về dữ liệu mặc định, xóa key `hotel-luxe-about-data` trong localStorage
3. Chỉ admin mới có thể thấy và sử dụng các nút chỉnh sửa
4. Tất cả thay đổi sẽ được lưu ngay lập tức và hiển thị trên cả admin và client side

## Demo

1. Clear localStorage để reset về dữ liệu mặc định
2. Đăng nhập admin và truy cập `/admin/about`
3. Thử chỉnh sửa một số thông tin
4. Mở tab mới và truy cập `/about` để xem thay đổi
5. Thử thêm/sửa/xóa thành viên team
