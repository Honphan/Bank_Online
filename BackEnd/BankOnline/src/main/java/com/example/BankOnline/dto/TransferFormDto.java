package com.example.BankOnline.dto;

import com.example.BankOnline.Enum.BankAccountType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransferFormDto {
     private BankAccountType fromAccount;
     private BankAccountType toAccount;
     private String amount;
     private String description;
}
