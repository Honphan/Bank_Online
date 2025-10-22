package com.example.BankOnline.dto;


import com.example.BankOnline.Enum.BankAccountType;
import com.example.BankOnline.entity.BankAccount;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BankAccountDto {
    private String accountNumber;
    private BankAccountType accountType;
    private BigDecimal balance;
    private String currency = "VND";
}
