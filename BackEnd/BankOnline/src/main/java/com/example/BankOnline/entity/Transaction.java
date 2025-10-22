package com.example.BankOnline.entity;


import com.example.BankOnline.Enum.TransactionStatus;
import com.example.BankOnline.Enum.TransactionType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table
@Data
@NoArgsConstructor
public class Transaction {

    @Id
    @Column(length = 36)
    private String transactionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn
    private BankAccount bankAccount;

    @NotNull
    private String bankAccountNumberTo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType transactionType;

    @Column(precision = 19, scale = 4, nullable = false)
    private BigDecimal amount;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionStatus status;

    @Column(updatable = false)
    private LocalDateTime transactionDate;

    @PrePersist
    protected void onCreate() {
        transactionDate = LocalDateTime.now();
    }
}

