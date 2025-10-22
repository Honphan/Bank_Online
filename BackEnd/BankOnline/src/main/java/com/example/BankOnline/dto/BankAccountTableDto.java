package com.example.BankOnline.dto;

import com.example.BankOnline.Enum.AccountStatus;
import com.example.BankOnline.Enum.BankAccountType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BankAccountTableDto {
    private String accountId;
    private String accountNumber;
    private String username;
    private String fullName;
    private String email;
    private BigDecimal balance;
    private String currency;
    private AccountStatus status;
    private BankAccountType accountType;
}
