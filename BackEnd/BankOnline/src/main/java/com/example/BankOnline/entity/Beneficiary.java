package com.example.BankOnline.entity;


import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table
@Data
@NoArgsConstructor
public class Beneficiary {

    @Id
    @Column(length = 36)
    private String beneficiaryId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn( nullable = false)
    private UserAccount userAccount;

    @Column(length = 100)
    private String nickname;

    @Column(length = 20, nullable = false)
    private String beneficiaryAccountNumber;

    @Column(length = 200, nullable = false)
    private String beneficiaryName;

    @Column(length = 100, nullable = false)
    private String bankName;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}

