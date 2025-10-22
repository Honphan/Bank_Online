package com.example.BankOnline.service;

import com.example.BankOnline.dto.*;

public interface UserAccountService {
    ApiResponseDto getUserInfo(String username);
    ApiResponseDto updateUserInfo(String username, UserDto userDto);
    ResponeDto changePassword(PassWordDto passWordDto, String username);
    ApiResponseDto getBankAccounts(String username);
    ResponeDto transferMoney(String username, TransferFormDto transferFormDto);
    ResponeDto addUserAccount(UserAccountDto userAccountDto);
}
