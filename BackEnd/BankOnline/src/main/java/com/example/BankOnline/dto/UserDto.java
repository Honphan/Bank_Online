package com.example.BankOnline.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private String fullName;
    private String email;
    private String phoneNumber;
    private String address;
    private Date dateOfBirth;
}
