package com.example.BankOnline.entity;

import com.example.BankOnline.Enum.AccountStatus;
import com.example.BankOnline.Enum.BankAccountType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@Table
@ToString(exclude = "userAccount")  // If using Lombok
public class BankAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String accountId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn( nullable = false)
    private UserAccount userAccount;

    @OneToMany(mappedBy = "bankAccount", cascade = CascadeType.ALL, orphanRemoval = true)
    List<Transaction> transactionFrom;


    @Column(unique = true, nullable = false)
    private String accountNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private BankAccountType accountType;

    @Column(nullable = false)
    private BigDecimal balance;

    private String currency;

    @Enumerated(EnumType.STRING)
    private AccountStatus status;

    @Override
    public String toString() {
        return "BankAccount{" +
                "accountNumber='" + accountNumber + '\'' +
                ", balance=" + balance +
                ", accountType=" + accountType +
                // Don't include userAccount here
                '}';
    }
}
