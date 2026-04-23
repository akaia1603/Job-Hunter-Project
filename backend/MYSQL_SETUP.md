# 🗄️ Hướng dẫn cài đặt MySQL và kết nối Backend

## Bước 1: Cài đặt MySQL

### Windows
1. Tải **MySQL Installer** tại: https://dev.mysql.com/downloads/installer/
2. Chọn **MySQL Server** + **MySQL Workbench** (GUI quản lý)
3. Trong quá trình cài đặt:
   - Chọn **Developer Default**
   - Đặt password cho user `root` (ví dụ: `123456`)
   - Port mặc định: `3306`
4. Sau khi cài xong, mở **MySQL Workbench** để kiểm tra kết nối

### Hoặc dùng XAMPP (đơn giản hơn)
1. Tải XAMPP: https://www.apachefriends.org/
2. Cài đặt và mở **XAMPP Control Panel**
3. Bấm **Start** MySQL
4. Truy cập phpMyAdmin: http://localhost/phpmyadmin

---

## Bước 2: Tạo Database

Mở MySQL Workbench hoặc phpMyAdmin, chạy lệnh:

```sql
CREATE DATABASE jobhunter;
```

---

## Bước 3: Cấu hình Spring Boot

File `src/main/resources/application.properties` đã được cấu hình sẵn:

```properties
# Thay đổi nếu cần:
spring.datasource.url=jdbc:mysql://localhost:3306/jobhunter
spring.datasource.username=root
spring.datasource.password=       # <-- Thêm password MySQL của bạn vào đây

# Tự động tạo/cập nhật bảng
spring.jpa.hibernate.ddl-auto=update
```

### ⚠️ Quan trọng: Thêm password MySQL

Mở file `application.properties` và thêm dòng:
```properties
spring.datasource.password=your_mysql_password_here
```

---

## Bước 4: Cài đặt JDK

Backend cần **Java 17+**:
1. Tải JDK 17: https://adoptium.net/ hoặc https://www.oracle.com/java/technologies/downloads/
2. Cài đặt và thêm vào PATH
3. Kiểm tra: `java -version`

---

## Bước 5: Chạy Backend

```bash
# Cách 1: Nếu có Maven wrapper trong project
./mvnw spring-boot:run

# Cách 2: Nếu dùng Gradle
./gradlew bootRun

# Cách 3: Dùng IDE
# Mở project trong IntelliJ IDEA / VS Code
# Chạy file JobhunterApplication.java
```

Backend sẽ chạy tại: `http://localhost:8080`

---

## Bước 6: Kết nối Frontend với Backend

1. Mở file `.env` trong thư mục gốc
2. Sửa:
```env
EXPO_PUBLIC_API_URL=http://localhost:8080/api
EXPO_PUBLIC_USE_MOCK=false
```

3. Restart Expo:
```bash
npx expo start --web
```

---

## Bước 7: Test API

Sau khi backend chạy, test bằng trình duyệt hoặc Postman:

### Login
```
POST http://localhost:8080/api/v1/auth/login
Body: { "username": "admin@gmail.com", "password": "123456" }
```

### Lấy danh sách Jobs
```
GET http://localhost:8080/api/v1/jobs
```

### Lấy danh sách Companies
```
GET http://localhost:8080/api/v1/companies
```

---

## Swagger API Docs

Backend đã tích hợp Swagger. Sau khi chạy, truy cập:
- http://localhost:8080/swagger-ui.html

---

## 🔧 Troubleshooting

### Lỗi "Access denied for user 'root'@'localhost'"
→ Kiểm tra password trong `application.properties`

### Lỗi "Communications link failure"
→ MySQL chưa chạy. Mở XAMPP hoặc start MySQL service

### Lỗi "Unknown database 'jobhunter'"
→ Chưa tạo database. Chạy: `CREATE DATABASE jobhunter;`

### CORS Error trên Frontend
→ Backend đã cấu hình CORS trong `CorsConfig.java`. Nếu vẫn lỗi, kiểm tra origin URL.
