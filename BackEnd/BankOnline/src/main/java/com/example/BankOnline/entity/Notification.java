package com.example.BankOnline.entity;

import com.example.BankOnline.Enum.NotificationType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;

@Entity
@Table
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long NotificationId;

    @Column(length = 36)
    private String title;

    @Column(length = 255)
    private String content;

    @Column(length = 30)
    @Enumerated(EnumType.STRING)
    private NotificationType type;

    @Column
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column
    private LocalDateTime expiresAt; // Thời gian hết hạn

    @Column
    private Boolean isRead = false; // Trạng thái đã đọc

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_account_user_account_id",nullable = false)
    @ToString.Exclude // tránh toString() gây recursion khi entity có liên kết hai chiều
    private UserAccount userAccount;

 }
