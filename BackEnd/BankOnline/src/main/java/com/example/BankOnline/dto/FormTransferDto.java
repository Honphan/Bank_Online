package com.example.BankOnline.dto;

import com.example.BankOnline.Enum.BankAccountType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FormTransferDto {
    private BigDecimal amount;
    private String description;
    private BankAccountType fromAccountType;
    private String toAcccountNumber;
}
