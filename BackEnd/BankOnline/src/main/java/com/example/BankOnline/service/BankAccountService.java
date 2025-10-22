package com.example.BankOnline.service;

import com.example.BankOnline.dto.*;
import com.example.BankOnline.entity.BankAccount;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Map;

public interface BankAccountService {
    String generateUniqueBankAccountNumber();
    ApiResponseDto getBankAccounts(String toAccountNumber,String username);
    ResponeDto transferMoney(String username, FormTransferDto formTransferDto);
    ResponeDto depositPhone(PhoneDepositDto phoneDepositDto, String username);
    PageResponseDto<BankAccountTableDto> filterBankAccounts(Map<String, String> filter, Pageable pageable);
    ResponeDto depositBankAccount(DepositFormDto depositFormDto);
}
