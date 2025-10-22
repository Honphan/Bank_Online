package com.example.BankOnline.dto;

import com.example.BankOnline.Enum.BankAccountStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChangeStatusDto {
    private String accountNumber;
    private String newStatus;
}
