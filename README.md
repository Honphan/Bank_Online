📁 Cấu Trúc Dự Án
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
