package com.example.BankOnline.entity;


import com.example.BankOnline.Enum.Role;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Data
@Table
@NoArgsConstructor
public class Administrator {
    @Id
    @Column(length = 36)
    private String adminId;

    @Column(length = 100, unique = true, nullable = false)
    private String username;

    @Column(length = 255, nullable = false)
    private String passwordHash;

    @Column(length = 200)
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}

