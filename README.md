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
