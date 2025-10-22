package com.example.BankOnline.service;

import com.example.BankOnline.dto.ApiResponseDto;
import com.example.BankOnline.dto.LoginDto;
import com.example.BankOnline.dto.RegisterDto;
import com.example.BankOnline.dto.ResponeDto;


public interface AuthService {
    ResponeDto register(RegisterDto registerDto);
    ApiResponseDto login(LoginDto loginDto);
}
