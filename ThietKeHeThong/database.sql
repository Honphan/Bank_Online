use bank_online;

-- Kịch bản tạo cơ sở dữ liệu cho Hệ thống Ngân hàng Trực tuyến
-- Hệ quản trị CSDL: MySQL
-- Quy tắc đặt tên: camelCase

-- Thiết lập để xóa các bảng nếu đã tồn tại
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS AuditLogs;
DROP TABLE IF EXISTS Beneficiaries;
DROP TABLE IF EXISTS Transactions;
DROP TABLE IF EXISTS BankAccounts;
DROP TABLE IF EXISTS UserAccounts;
DROP TABLE IF EXISTS Administrators;
DROP TABLE IF EXISTS Customers;
SET FOREIGN_KEY_CHECKS = 1;

-- Bảng lưu thông tin khách hàng (Customers)
CREATE TABLE Customers (
    customerId CHAR(36) PRIMARY KEY,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phoneNumber VARCHAR(20) UNIQUE NOT NULL,
    address TEXT,
    dateOfBirth DATE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng lưu thông tin đăng nhập của khách hàng (UserAccounts)
CREATE TABLE UserAccounts (
    userId CHAR(36) PRIMARY KEY,
    customerId CHAR(36) NOT NULL UNIQUE,
    username VARCHAR(100) UNIQUE NOT NULL,
    passwordHash VARCHAR(255) NOT NULL,
    status ENUM('ACTIVE', 'LOCKED', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    lastLogin DATETIME,
    FOREIGN KEY (customerId) REFERENCES Customers(customerId) ON DELETE CASCADE
);

-- Bảng tài khoản ngân hàng của khách (BankAccounts)
CREATE TABLE BankAccounts (
    accountId CHAR(36) PRIMARY KEY,
    customerId CHAR(36) NOT NULL,
    accountNumber VARCHAR(20) UNIQUE NOT NULL,
    accountType ENUM('CHECKING', 'SAVINGS') NOT NULL,
    balance DECIMAL(19, 4) NOT NULL DEFAULT 0.00,
    currency VARCHAR(3) NOT NULL DEFAULT 'VND',
    status ENUM('ACTIVE', 'CLOSED') NOT NULL DEFAULT 'ACTIVE',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customerId) REFERENCES Customers(customerId) ON DELETE CASCADE,
    CHECK (balance >= 0)
);

-- Bảng lịch sử giao dịch (Transactions)
CREATE TABLE Transactions (
    transactionId CHAR(36) PRIMARY KEY,
    fromAccountId CHAR(36),
    toAccountId CHAR(36),
    transactionType VARCHAR(50) NOT NULL,
    amount DECIMAL(19, 4) NOT NULL,
    description TEXT,
    status ENUM('PENDING_APPROVAL', 'COMPLETED', 'FAILED') NOT NULL,
    transactionDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fromAccountId) REFERENCES BankAccounts(accountId),
    FOREIGN KEY (toAccountId) REFERENCES BankAccounts(accountId),
    CHECK (amount > 0)
);

-- Bảng người thụ hưởng đã lưu (Beneficiaries)
CREATE TABLE Beneficiaries (
    beneficiaryId CHAR(36) PRIMARY KEY,
    ownerCustomerId CHAR(36) NOT NULL,
    nickname VARCHAR(100),
    beneficiaryAccountNumber VARCHAR(20) NOT NULL,
    beneficiaryName VARCHAR(200) NOT NULL,
    bankName VARCHAR(100) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ownerCustomerId) REFERENCES Customers(customerId) ON DELETE CASCADE
);

-- Bảng quản trị viên (Administrators)
CREATE TABLE Administrators (
    adminId CHAR(36) PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    passwordHash VARCHAR(255) NOT NULL,
    fullName VARCHAR(200),
    role ENUM('SUPER_ADMIN', 'TRANSACTION_MANAGER', 'SUPPORT') NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Bảng ghi nhật ký hệ thống (AuditLogs)
CREATE TABLE AuditLogs (
    logId BIGINT AUTO_INCREMENT PRIMARY KEY,
    actorId CHAR(36) NOT NULL,
    actorType ENUM('CUSTOMER', 'ADMIN') NOT NULL,
    action VARCHAR(255) NOT NULL,
    details JSON,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tạo chỉ mục (Indexes) để tăng tốc độ truy vấn
CREATE INDEX idx_transactions_fromAccount ON Transactions(fromAccountId);
CREATE INDEX idx_transactions_toAccount ON Transactions(toAccountId);
CREATE INDEX idx_bankAccounts_customer ON BankAccounts(customerId);
CREATE INDEX idx_beneficiaries_owner ON Beneficiaries(ownerCustomerId);

-- Ghi chú quan trọng:
-- 1. UUID: MySQL không có kiểu dữ liệu UUID gốc. Các cột ID (customerId, userId, etc.)
--    sử dụng CHAR(36). Việc tạo giá trị UUID cần được xử lý ở tầng ứng dụng (ví dụ: Spring Boot).
-- 2. CHECK Constraints: Các ràng buộc CHECK được hỗ trợ từ MySQL 8.0.16. Nếu bạn dùng
--    phiên bản cũ hơn, các ràng buộc này sẽ bị bỏ qua.
