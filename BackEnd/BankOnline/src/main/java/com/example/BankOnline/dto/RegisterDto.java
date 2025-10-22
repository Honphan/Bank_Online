package com.example.BankOnline.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterDto {
    // UserAccount fields
    @NotEmpty(message = "Username không được để trống")
    @Size(min = 3, max = 100, message = "Username phải từ 3 đến 100 ký tự")
    private String username;

    @NotEmpty(message = "Mật khẩu không được để trống")
    @Size(min = 1, message = "Mật khẩu phải có ít nhất 1 ký tự")
    private String password;

    private String fullName;


    @NotEmpty(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String email;

    @NotEmpty(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "^[0-9]{10,11}$", message = "Số điện thoại phải là 10-11 chữ số")
    private String phoneNumber;

}