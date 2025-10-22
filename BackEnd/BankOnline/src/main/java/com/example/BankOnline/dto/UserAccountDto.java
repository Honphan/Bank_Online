package com.example.BankOnline.dto;

import com.example.BankOnline.Enum.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserAccountDto {
    private String username;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String password;
    private Role role;
}
