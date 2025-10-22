package com.example.BankOnline.entity;

import com.example.BankOnline.Enum.AccountStatus;
import com.example.BankOnline.Enum.Role;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Entity
@Table
@Data
@NoArgsConstructor
public class UserAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String userAccountId;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column
    private AccountStatus status;

    @Column
    private String fullName;

    @Column
    private String email;

    @Column
    private String phoneNumber;
    @Column
    private String address;
    @Column
    private Date dateOfBirth;


    @OneToMany(mappedBy = "userAccount", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BankAccount> bankAccounts;

    @OneToMany(mappedBy = "userAccount", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Beneficiary> beneficiaries;

    @OneToMany(mappedBy = "userAccount", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Notification> notifications;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private Role role;

    @Column(updatable = false)
    private Date lastLogin;

    @Override
    public String toString() {
        return "UserAccount{id=" + this.userAccountId
                + ", username='" + this.username + "'"
                + ", email='" + this.email + "'}";
    }

}

