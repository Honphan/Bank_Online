package com.example.BankOnline.service;


import com.example.BankOnline.Enum.AccountStatus;
import com.example.BankOnline.Enum.BankAccountType;
import com.example.BankOnline.Enum.Role;
import com.example.BankOnline.dto.*;
import com.example.BankOnline.entity.BankAccount;
import com.example.BankOnline.entity.UserAccount;
import com.example.BankOnline.repository.BankAccountRepository;
import com.example.BankOnline.repository.UserAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class UserAccountServiceImpl implements UserAccountService {
    @Autowired
    private UserAccountRepository userAccountRepository;

    @Autowired
    private BankAccountRepository bankAccountRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private BankAccountService bankAccountService;

    @Override
    public ApiResponseDto getUserInfo(String username) {
        UserAccount userAccount = userAccountRepository.findByUsername(username).get();
        if (userAccount != null) {
            UserDto userDto = new UserDto(userAccount.getFullName(), userAccount.getEmail(), userAccount.getPhoneNumber(), userAccount.getAddress(), userAccount.getDateOfBirth());
            return new ApiResponseDto("thanh cong", 200, "", userDto);
        }
        return new ApiResponseDto("khong ton tai tai khoan", 404, "", null);
    }

    @Override
    public ApiResponseDto updateUserInfo(String username, UserDto userDto) {
        UserAccount userAccount = userAccountRepository.findByUsername(username).get();
        if (userAccount != null) {
            userAccount.setFullName(userDto.getFullName());
            userAccount.setEmail(userDto.getEmail());
            userAccount.setPhoneNumber(userDto.getPhoneNumber());
            userAccount.setAddress(userDto.getAddress());
            userAccount.setDateOfBirth(userDto.getDateOfBirth());
            userAccountRepository.save(userAccount);
            return new ApiResponseDto("thanh cong", 200, "", null);
        }
        return new ApiResponseDto("khong ton tai tai khoan", 404, "", null);
    }

    @Override
    public ResponeDto changePassword(PassWordDto passWordDto, String username) {
        UserAccount userAccount = userAccountRepository.findByUsername(username).get();
        if (userAccount != null) {
            if (passwordEncoder.matches(passWordDto.getCurrentPassword(), userAccount.getPasswordHash())) {
                userAccount.setPasswordHash(passwordEncoder.encode(passWordDto.getNewPassword()));
                userAccountRepository.save(userAccount);
                return new ResponeDto("Đổi mật khẩu thành công", 200);
            }
            return new ResponeDto("Mật khẩu cũ không chính xác", 400);
        }
        return new ResponeDto("Không tìm thấy tài khoản", 404);
    }

    @Override
    public ApiResponseDto getBankAccounts(String username) {
        UserAccount userAccount = userAccountRepository.findByUsername(username).get();
        List<BankAccount> bankAccounts = userAccount.getBankAccounts();
        List<BankAccountDto> bankAccountDtoList = new ArrayList<>();

        for (BankAccount bankAccount : bankAccounts) {
            BankAccountDto bankAccountDto = new BankAccountDto();
            bankAccountDto.setAccountNumber(bankAccount.getAccountNumber());
            bankAccountDto.setBalance(bankAccount.getBalance());
            bankAccountDto.setAccountType(bankAccount.getAccountType());
            bankAccountDtoList.add(bankAccountDto);
        }
        if (bankAccounts != null) {
            return new ApiResponseDto("thanh cong", 200, "", bankAccountDtoList);
        }
        return new ApiResponseDto("khong ton tai tai khoan", 404, "", null);
    }

    @Override
    public ResponeDto transferMoney(String username, TransferFormDto transferFormDto) {
        UserAccount userAccount = userAccountRepository.findByUsername(username).get();
        BankAccount fromAccount = userAccount.getBankAccounts().stream()
                .filter(bankAccount -> bankAccount.getAccountType().equals(transferFormDto.getFromAccount()))
                .findFirst()
                .orElse(null);

        BankAccount toAccount = userAccount.getBankAccounts().stream()
                .filter(bankAccount -> bankAccount.getAccountType().equals(transferFormDto.getToAccount()))
                .findFirst()
                .orElse(null);

        if (fromAccount == null || toAccount == null) {
            return new ResponeDto("Chuyen tien khong thanh cong", 400);
        }

        if(fromAccount.getAccountType() == BankAccountType.USD){
            BigDecimal transferAmount = new BigDecimal(transferFormDto.getAmount());
            fromAccount.setBalance(fromAccount.getBalance().subtract(transferAmount));

            toAccount.setBalance(toAccount.getBalance().add(transferAmount.multiply(new BigDecimal(25000))));
            bankAccountRepository.save(fromAccount);
            bankAccountRepository.save(toAccount);
            return new ResponeDto("Chuyen tien thanh cong", 200);
        } else if (toAccount.getAccountType() == BankAccountType.USD) {
            BigDecimal transferAmount = new BigDecimal(transferFormDto.getAmount());
            fromAccount.setBalance(fromAccount.getBalance().subtract(transferAmount));

            toAccount.setBalance(toAccount.getBalance().add(transferAmount.multiply(new BigDecimal(0.00004))));
            bankAccountRepository.save(fromAccount);
            bankAccountRepository.save(toAccount);
            return new ResponeDto("Chuyen tien thanh cong", 200);
        }
        else {
            BigDecimal transferAmount = new BigDecimal(transferFormDto.getAmount());
            fromAccount.setBalance(fromAccount.getBalance().subtract(transferAmount));

            toAccount.setBalance(toAccount.getBalance().add(transferAmount));
            bankAccountRepository.save(fromAccount);
            bankAccountRepository.save(toAccount);
            return new ResponeDto("Chuyen tien thanh cong", 200);
        }
    }

    @Override
    public ResponeDto addUserAccount(UserAccountDto userAccountDto) {

        if (userAccountRepository.existsByUsername(userAccountDto.getUsername())) {
            return new ResponeDto("Tài khoản này đã có trong hệ thống", 400);
        }

        try {

            // Tạo UserAccount entity
            UserAccount userAccount = new UserAccount();
            userAccount.setUsername(userAccountDto.getUsername());
            userAccount.setEmail(userAccountDto.getEmail());
            userAccount.setPhoneNumber(userAccountDto.getPhoneNumber());
            userAccount.setFullName(userAccountDto.getFullName());
            userAccount.setPasswordHash(passwordEncoder.encode(userAccountDto.getPassword()));
            userAccount.setStatus(AccountStatus.ACTIVE);
            userAccount.setRole(userAccountDto.getRole());


            BankAccount checkingAccount = new BankAccount();
            checkingAccount.setAccountNumber(bankAccountService.generateUniqueBankAccountNumber());
            checkingAccount.setStatus(AccountStatus.ACTIVE);
            checkingAccount.setBalance(BigDecimal.valueOf(0));
            checkingAccount.setAccountType(BankAccountType.CHECKING);
            checkingAccount.setUserAccount(userAccount);

            BankAccount savingsAccount = new BankAccount();
            savingsAccount.setAccountNumber(bankAccountService.generateUniqueBankAccountNumber());
            savingsAccount.setStatus(AccountStatus.ACTIVE);
            savingsAccount.setBalance(BigDecimal.valueOf(0));
            savingsAccount.setAccountType(BankAccountType.SAVINGS);
            savingsAccount.setUserAccount(userAccount);

            BankAccount usdAccount = new BankAccount();
            usdAccount.setAccountNumber(bankAccountService.generateUniqueBankAccountNumber());
            usdAccount.setStatus(AccountStatus.ACTIVE);
            usdAccount.setBalance(BigDecimal.valueOf(0));
            usdAccount.setAccountType(BankAccountType.USD);
            usdAccount.setCurrency("USD");
            usdAccount.setUserAccount(userAccount);

            userAccount.setBankAccounts(List.of(checkingAccount, savingsAccount, usdAccount));

            userAccountRepository.save(userAccount);

            return new ResponeDto("Đăng ký thành công", 200);
        } catch (Exception e) {
            return new ResponeDto("Lỗi đăng ký: " + e.getMessage(), 500);
        }
    }
}
