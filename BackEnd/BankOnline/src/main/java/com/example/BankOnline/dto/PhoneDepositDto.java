package com.example.BankOnline.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PhoneDepositDto {
    private String phoneNumber;
    private BigDecimal amount;
}
