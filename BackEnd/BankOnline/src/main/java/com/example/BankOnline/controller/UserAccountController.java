package com.example.BankOnline.controller;

import com.example.BankOnline.dto.*;
import com.example.BankOnline.service.UserAccountService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/")
public class UserAccountController {
    private final UserAccountService userAccountService;


    public UserAccountController(UserAccountService userAccountService) {
        this.userAccountService = userAccountService;
    }

    @GetMapping("user/profile")
    public ApiResponseDto getUserInfo(Authentication authentication) {
        String username = authentication.getName();
        ApiResponseDto apiResponseDto = userAccountService.getUserInfo(username);
        return apiResponseDto;
    }


    @PatchMapping("user/profile")
    public ApiResponseDto UpdateUser(@RequestBody UserDto userDto, Authentication authentication) {
        return userAccountService.updateUserInfo(authentication.getName(),userDto);
    }

    @PostMapping("user/change-password")
    public ResponeDto changePassword(@RequestBody PassWordDto passWordDto, Authentication authentication) {
        String username = authentication.getName();
        ResponeDto  responeDto= userAccountService.changePassword(passWordDto,username);
        return responeDto;
    }

    @GetMapping("user/bank-accounts")
    public ApiResponseDto getBankAccounts(Authentication authentication) {
        ApiResponseDto apiResponseDto = userAccountService.getBankAccounts(authentication.getName());
        return apiResponseDto;
    }

    @PostMapping("user/exchange")
    public ResponeDto transfer(@RequestBody TransferFormDto transferFormDto, Authentication authentication) {
        String username = authentication.getName();
        return userAccountService.transferMoney(username,transferFormDto);
    }

    @PostMapping("admin/user-account")
    public ResponeDto addUserAccount(@RequestBody UserAccountDto userAccountDto){
        return userAccountService.addUserAccount(userAccountDto);
    }
}
