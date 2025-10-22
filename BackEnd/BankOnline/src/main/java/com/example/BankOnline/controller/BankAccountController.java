package com.example.BankOnline.controller;

import com.example.BankOnline.Enum.AccountStatus;
import com.example.BankOnline.Enum.BankAccountType;
import com.example.BankOnline.dto.*;
import com.example.BankOnline.entity.BankAccount;
import com.example.BankOnline.entity.UserAccount;
import com.example.BankOnline.repository.BankAccountRepository;
import com.example.BankOnline.repository.UserAccountRepository;
import com.example.BankOnline.service.BankAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.function.EntityResponse;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api")
public class BankAccountController {
    @Autowired
    private BankAccountRepository bankAccountRepository;

    @Autowired
    private UserAccountRepository userAccountRepository;

    @Autowired
    private BankAccountService bankAccountService;

    @PostMapping("/bank-account")
    public ApiResponseDto getBankAccountInfo(@RequestBody String toAccountNumber, Authentication authentication) {
      return bankAccountService.getBankAccounts(toAccountNumber,authentication.getName()) ;
    }

    @PostMapping("bank-account/transfer")
    public ResponeDto transferMoney(@RequestBody FormTransferDto formTransferDto, Authentication authentication) {
        return bankAccountService.transferMoney(authentication.getName(), formTransferDto);
    }

    @PostMapping("bank-account/deposit-phone")
    public ResponeDto depositPhone(@RequestBody PhoneDepositDto phoneDepositDto, Authentication authentication) {
       return bankAccountService.depositPhone(phoneDepositDto,authentication.getName());
    }

    @GetMapping("/bank-accounts")
    public List<BankAccountTableDto> getBankAccounts(Authentication authentication) {
        List<BankAccount> bankAccounts = bankAccountRepository.findAll();
        List<BankAccountTableDto> bankAccountTableDtoList =new ArrayList<>();
        for (BankAccount bankAccount : bankAccounts) {
            BankAccountTableDto bankAccountTableDto = new BankAccountTableDto();
            bankAccountTableDto.setAccountId(bankAccount.getAccountId());
            bankAccountTableDto.setAccountNumber(bankAccount.getAccountNumber());
            bankAccountTableDto.setBalance(bankAccount.getBalance());
            bankAccountTableDto.setStatus(bankAccount.getStatus());
            bankAccountTableDto.setCurrency(bankAccount.getCurrency());
            bankAccountTableDto.setUsername(bankAccount.getUserAccount().getUsername());
            bankAccountTableDto.setEmail(bankAccount.getUserAccount().getEmail());
            bankAccountTableDto.setFullName(bankAccount.getUserAccount().getFullName());
            bankAccountTableDto.setAccountType(bankAccount.getAccountType());
            bankAccountTableDtoList.add(bankAccountTableDto);
        }

        return bankAccountTableDtoList;
    }

    @PostMapping("admin/bank-account/change-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponeDto changeStatus(@RequestBody ChangeStatusDto changeStatusDto){
        BankAccount bankAccount = bankAccountRepository.findByAccountNumber(changeStatusDto.getAccountNumber());
        if(bankAccount != null){
            bankAccount.setStatus(AccountStatus.valueOf(changeStatusDto.getNewStatus()));
            bankAccountRepository.save(bankAccount);
            return new ResponeDto("doi trang thai thanh cong",200);
        }
        return new ResponeDto("doi trang thai khong thanh cong",400);
    }

    @DeleteMapping("admin/bank-account/{accountId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponeDto deleteBankAccount(@PathVariable String accountId) {
        BankAccount bankAccount = bankAccountRepository.findByAccountId(accountId.trim());
        if(bankAccount != null) {
            bankAccount.setStatus(AccountStatus.LOCKED);
            bankAccountRepository.save(bankAccount);
            return new ResponeDto("xoa thanh cong", 200);
        }
        return new ResponeDto("xoa khong thanh cong", 400);
    }

    @GetMapping("admin/bank-account")
    public PageResponseDto<BankAccountTableDto> filterBankAccount(@RequestParam Map<String, String> params) {
        Pageable pageable = PageRequest.of(Integer.parseInt(params.get("page")),Integer.parseInt(params.get("size")));

        return bankAccountService.filterBankAccounts(params, pageable);
    }

    @PostMapping("admin/bank-account/deposit")
    public ResponeDto depositBankAccount(@RequestBody DepositFormDto depositFormDto){
        return bankAccountService.depositBankAccount(depositFormDto);
    }
}