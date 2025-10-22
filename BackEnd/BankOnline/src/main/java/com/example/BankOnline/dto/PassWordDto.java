package com.example.BankOnline.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PassWordDto {
    private String currentPassword;
    private String newPassword;
}
