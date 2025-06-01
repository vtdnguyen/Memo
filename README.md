# 📱 Memo – Lưu giữ từng khoảnh khắc quý giá

> *Nơi mọi khoảnh khắc tìm thấy ngôi nhà của mình*

**Memo** thay đổi cách bạn lưu giữ những khoảnh khắc đẹp trong cuộc sống. Không chỉ là một ứng dụng chụp ảnh thông thường, Memo là kho lưu trữ ký ức cá nhân kết nối bạn với bạn bè thông qua những trải nghiệm chung và cuộc trò chuyện thời gian thực.

Được xây dựng với công nghệ tiên tiến sử dụng [Expo](https://expo.dev), Memo mang đến trải nghiệm mượt mà trên các nền tảng Android, iOS và Web.

## ✨ Tại sao chọn Memo?

🎯 **Lưu giữ ký ức dễ dàng** – Chụp, lưu và trân trọng những khoảnh khắc tức thì  
👥 **Kết nối xã hội** – Chia sẻ ký ức và giữ liên lạc với bạn bè  
💬 **Nhắn tin thời gian thực** – Trò chuyện ngay lập tức khi xem ảnh chung  
🌐 **Đa nền tảng** – Ký ức của bạn, ở mọi nơi bạn đến  
🔒 **Bảo mật tối ưu** – Khoảnh khắc của bạn, bạn là người kiểm soát  

## 🚀 Bắt đầu nhanh

Chạy Memo trong vòng chưa đầy 2 phút:

```bash
# Install dependencies
npm install

# Launch the development server
npx expo start
```

### 📲 Chọn nền tảng của bạn

| Nền tảng | Cách truy cập |
|----------|---------------|
| 📱 **Di động** | Quét mã QR bằng ứng dụng Expo Go |
| 🖥️ **Web** | Nhấn `w` trong terminal hoặc truy cập localhost |
| 🔧 **Trình giả lập** | Nhấn `i` (iOS) hoặc `a` (Android) |
| 📦 **Sản xuất** | Build với `npx expo build` |

## 🏗️ Tổng quan kiến trúc
```
Memo/
┣━━ 📂 app/                         # Màn hình và định tuyến qua Expo Router
┃   ┣━━ 📂 (tabs)/                  # Các màn hình tab điều hướng
┃   ┣━━ sign-in.tsx                 # Màn hình đăng nhập
┃   ┣━━ sign-up.tsx                 # Màn hình đăng ký
┃   ┣━━ onboarding.tsx              # Màn hình giới thiệu
┃   ┣━━ +not-found.tsx              # Màn hình lỗi 404
┃   ┗━━ _layout.tsx                 # Layout gốc cho routing
┣━━ 📂 assets/                      # Tài nguyên tĩnh của ứng dụng
┃   ┣━━ 📂 images/                  # Hình ảnh UI
┃   ┣━━ 📂 fonts/                   # Font chữ tùy chỉnh
┃   ┣━━ 📂 animations/              # Animation (Lottie, GIF)
┃   ┣━━ 📂 logo/                    # Hình ảnh logo
┃   ┗━━ 📂 onboarding/              # Hình onboarding
┣━━ 📂 constants/                   # Hằng số toàn ứng dụng
┃   ┣━━ Colors.ts                   # Màu sắc chủ đề
┃   ┣━━ icon.ts                     # Danh sách icon
┃   ┗━━ image.ts                    # Danh sách hình ảnh
┣━━ 📂 src/                         # Logic chính của ứng dụng
┃   ┣━━ 📂 components/              # UI component tái sử dụng
┃   ┃   ┣━━ 📂 auth/                # Component đăng nhập/đăng ký
┃   ┃   ┣━━ 📂 friend/              # Component liên quan bạn bè
┃   ┃   ┣━━ 📂 home/                # Component giao diện chính
┃   ┃   ┗━━ ...                     # Component khác
┃   ┣━━ 📂 contexts/                # React Context API
┃   ┃   ┣━━ ImageContext.tsx        # Quản lý ảnh người dùng
┃   ┃   ┗━━ SocketContext.tsx       # Kết nối socket
┃   ┣━━ 📂 hooks/                   # Custom React Hooks
┃   ┃   ┣━━ useMessages.ts          # Hook xử lý tin nhắn
┃   ┃   ┣━━ useFont.ts              # Hook load font
┃   ┃   ┗━━ ...                     # Hook khác
┃   ┣━━ 📂 redux/                   # Quản lý state với Redux
┃   ┃   ┣━━ 📂 slices/              # Các slice chia theo tính năng
┃   ┃   ┣━━ hook.ts/                # Hook kết nối Redux
┃   ┃   ┗━━ store.ts                # Cấu hình Redux store
┃   ┗━━ 📂 types/                   # Định nghĩa kiểu dữ liệu
┃       ┣━━ auth.ts                 # Kiểu dữ liệu auth
┃       ┣━━ friend.ts               # Kiểu dữ liệu bạn bè
┃       ┗━━ message.ts              # Kiểu dữ liệu tin nhắn
┣━━ 📄 app.json                     # Cấu hình dự án Expo
┣━━ 📄 package.json                 # Danh sách dependencies & scripts
┗━━ 📄 README.md                    # Tài liệu mô tả dự án
```

## 🎨 Tính năng chính

### 📸 **Quản lý ký ức**
- Chụp và xử lý hình ảnh chất lượng cao
- Tổ chức thông minh với thẻ và ngày tháng  
- Thao tác hàng loạt để quản lý hiệu quả

### 👫 **Tính năng xã hội**
- Khám phá và kết nối bạn bè
- Chia sẻ ký ức với kiểm soát quyền riêng tư
- Bình luận và phản ứng với ký ức được chia sẻ

### 💬 **Trò chuyện thời gian thực**
- Nhắn tin tức thì với bạn bè
- Chia sẻ ký ức trực tiếp trong cuộc trò chuyện
- Trò chuyện để thảo luận về ký ức

### 🔧 **Điểm nổi bật kỹ thuật**
- **Expo Router** cho điều hướng type-safe
- **Redux Toolkit** cho quản lý trạng thái dự đoán được
- **Socket.io** cho đồng bộ dữ liệu thời gian thực

## 📖 Tài liệu & Nguồn tham khảo

### Đọc cần thiết
- 📘 [Tài liệu Expo](https://docs.expo.dev/) – Hướng dẫn nền tảng hoàn chỉnh
- 🗺️ [Hướng dẫn Expo Router](https://docs.expo.dev/router/introduction/) – Làm chủ điều hướng
- 📷 [API Image Picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/) – Chụp ảnh

### Chủ đề nâng cao
- 🏪 [Redux Toolkit](https://redux-toolkit.js.org/) – Quản lý trạng thái
- 🎨 [React Native Elements](https://reactnativeelements.com/) – Component UI
- 🔒 [Expo SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/) – Lưu trữ bảo mật

## 🤝 Đóng góp

Chúng tôi hoan nghênh các đóng góp! Đây là cách bắt đầu:

1. **Fork** repository
2. **Tạo** nhánh tính năng  (`git checkout -b feature/tinh-nang-tuyet-voi`)
3. **Commit** thay đổi của bạn (`git commit -m 'Thêm tính năng tuyệt vời'`)
4. **Push** lên nhánh (`git push origin feature/tinh-nang-tuyet-voi`)
5. **Mở** Pull Request

---

<div align="center">

### 🌟 Built with ❤️ by Team **400 Bad Request**

*Making every moment memorable since 2025*

**© 2025 Memo App – All moments matter.**

</div>