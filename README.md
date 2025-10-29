## 🛠️ Công Nghệ Sử Dụng

### 🔹 Backend
- **Framework:** Spring Boot `3.5.6`  
- **Ngôn ngữ:** Java `21`  
- **Bảo mật:** Spring Security + JWT  
- **Cơ sở dữ liệu:** MySQL  
- **WebSocket:** STOMP over WebSocket  
- **Công cụ build:** Maven  

### 🔹 Frontend
- **Framework:** React `19.1.1`  
- **Routing:** React Router DOM `7.9.4`  
- **Quản lý state:** Redux Toolkit `2.9.0`  
- **HTTP Client:** Axios `1.12.2`  
- **WebSocket:** @stomp/stompjs `7.2.1`  
- **Công cụ build:** Vite `7.1.7`
```bash
online-banking/
├── BackEnd/
│   └── BankOnline/
│       ├── src/main/java/com/example/BankOnline/
│       │   ├── config/          # Cấu hình Security, CORS, WebSocket
│       │   ├── controller/      # Các REST API endpoints
│       │   ├── dto/            # Data Transfer Objects
│       │   ├── entity/         # Các entity JPA
│       │   ├── Enum/           # Các kiểu liệt kê
│       │   ├── repository/     # Repositories cơ sở dữ liệu
│       │   ├── security/       # Triển khai JWT & Security
│       │   ├── service/        # Logic nghiệp vụ
│       │   └── utils/          # Các class tiện ích
│       └── src/main/resources/
│           └── application.properties
│
└── FrontEnd/
    └── online-banking-frontend/
        ├── src/
        │   ├── api/            # API client & WebSocket
        │   ├── assets/         # Styles & hình ảnh
        │   ├── components/     # Các React components
        │   ├── pages/          # Các Page components
        │   ├── routes/         # Bảo vệ route
        │   └── utils/          # Hàm tiện ích
        └── package.json
```
## ⚙️ Cài Đặt Backend

### 🧩 Clone repository
```bash
git clone <repository-url>
cd BackEnd/BankOnline
```

### 🗄️ Cấu hình cơ sở dữ liệu
File: `src/main/resources/application.properties`
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/bank_online
spring.datasource.username=root
spring.datasource.password=mat_khau_cua_ban
```

### 🧱 Tạo cơ sở dữ liệu
```sql
CREATE DATABASE bank_online;
```

### 🚀 Chạy ứng dụng
```bash
mvn clean install
mvn spring-boot:run
```

➡️ **Backend** sẽ chạy tại: [http://localhost:8081](http://localhost:8081)

---

## ⚙️ Cài Đặt Frontend

### 📂 Di chuyển đến thư mục frontend
```bash
cd FrontEnd/online-banking-frontend
```

### 📦 Cài đặt dependencies
```bash
npm install
```

### 🚀 Chạy development server
```bash
npm run dev
```

➡️ **Frontend** sẽ chạy tại: [http://localhost:5173](http://localhost:5173)
