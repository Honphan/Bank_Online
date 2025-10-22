package com.example.BankOnline.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DepositFormDto {
    private String accountId;
    private BigDecimal amount;
    private String description;
}
