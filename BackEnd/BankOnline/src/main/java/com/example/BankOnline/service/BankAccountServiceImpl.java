package com.example.BankOnline.service;

import com.example.BankOnline.Enum.BankAccountType;
import com.example.BankOnline.Enum.NotificationType;
import com.example.BankOnline.dto.*;
import com.example.BankOnline.entity.BankAccount;
import com.example.BankOnline.entity.Notification;
import com.example.BankOnline.entity.Transaction;
import com.example.BankOnline.entity.UserAccount;
import com.example.BankOnline.repository.BankAccountRepository;
import com.example.BankOnline.repository.NotificationRepository;
import com.example.BankOnline.repository.UserAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class BankAccountServiceImpl implements BankAccountService{
    @Autowired
    private BankAccountRepository bankAccountRepository;
    @Autowired
    private UserAccountRepository userAccountRepository;
    @Autowired
    private NotificationRepository notificationRepository;

    public String generateUniqueBankAccountNumber() {
        Random random = new Random();
        String accountNumber;

        do {
            // Ví dụ: Sinh dãy 12 chữ số bắt đầu bằng 9704
            accountNumber = "9704" + String.format("%08d", random.nextInt(100_000_000));
        } while (bankAccountRepository.existsByAccountNumber(accountNumber));

        return accountNumber;
    }

    @Override
    public ApiResponseDto getBankAccounts(String toAccountNumber, String username) {
        BankAccount bankAccount = bankAccountRepository.findByAccountNumber(toAccountNumber);

        if (bankAccount != null ) {
            // Check if the bank account belongs to this user
            boolean isBankAccountBelongsToUser = bankAccount.getUserAccount().getUsername().equals(username);

            if (!isBankAccountBelongsToUser) {
                // The bank account belongs to this user
                return new ApiResponseDto("thanh cong", 200, "", bankAccount.getUserAccount().getFullName());
            } else {
                // The bank account exists but doesn't belong to this user
                return new ApiResponseDto("tai khoan ngan hang thuoc nguoi dung nay", 403, "", null);
            }
        }

        return new ApiResponseDto("khong ton tai tai khoan", 404, "", null);
    }

    @Override
    public ResponeDto transferMoney(String username, FormTransferDto formTransferDto) {
        UserAccount userAccount = userAccountRepository.findByUsername(username).get();
        BankAccount FormBankAccountTransfer = userAccount.getBankAccounts().stream()
                .filter(bankAccount -> bankAccount.getAccountType().equals(formTransferDto.getFromAccountType()))
                .findFirst()
                .orElse(null);
        BankAccount toBankAccount = bankAccountRepository.findByAccountNumber(formTransferDto.getToAcccountNumber());
        if (FormBankAccountTransfer == null || toBankAccount == null) {
            return new ResponeDto("Chuyen tien khong thanh cong", 400);
        }

        if( toBankAccount.getAccountType() != FormBankAccountTransfer.getAccountType()){
            return new ResponeDto("Chuyen tien khac kieu tai khoan ", 400);
        }

        FormBankAccountTransfer.setBalance(FormBankAccountTransfer.getBalance().subtract(formTransferDto.getAmount()));
        toBankAccount.setBalance(toBankAccount.getBalance().add(formTransferDto.getAmount()));
        bankAccountRepository.save(FormBankAccountTransfer);
        bankAccountRepository.save(toBankAccount);
        return new ResponeDto("Chuyen tien thanh cong", 200);
    }

    @Override
    public ResponeDto depositPhone(PhoneDepositDto phoneDepositDto, String username) {
        UserAccount userAccount = userAccountRepository.findByUsername(username).get();
        BankAccount bankAccountChecking = userAccount.getBankAccounts().stream()
                .filter(bankAccount -> bankAccount.getAccountType().equals(BankAccountType.CHECKING))
                .findFirst()
                .orElse(null);
        if(bankAccountChecking == null){
            return new ResponeDto("Nap tien khong thanh cong", 400);
        }
        bankAccountChecking.setBalance(bankAccountChecking.getBalance().subtract(phoneDepositDto.getAmount()));
        bankAccountRepository.save(bankAccountChecking);
        return new ResponeDto("Nap tien thanh cong", 200);
    }

    @Override
    public PageResponseDto<BankAccountTableDto> filterBankAccounts(Map<String, String> filter, Pageable pageable) {
        // 1️⃣ Lấy dữ liệu gốc (entity) từ DB
        String username = filter.getOrDefault("username", null);
        String status = filter.getOrDefault("status", null);
        String fullName = filter.getOrDefault("fullName", null);
        String email = filter.getOrDefault("email", null);
        Page<BankAccount> bankAccountPage = bankAccountRepository.findBankAccountsByFilter(username,status,fullName,email,pageable);

        // 2️⃣ Lấy danh sách entity từ trang
        List<BankAccountTableDto> dtos = bankAccountPage.getContent().stream()
                .map(bankAccount -> {
                    BankAccountTableDto dto = new BankAccountTableDto();
                    dto.setAccountId(bankAccount.getAccountId());
                    dto.setAccountNumber(bankAccount.getAccountNumber());
                    dto.setBalance(bankAccount.getBalance());
                    dto.setStatus(bankAccount.getStatus());
                    dto.setCurrency(bankAccount.getCurrency());
                    dto.setUsername(bankAccount.getUserAccount().getUsername());
                    dto.setEmail(bankAccount.getUserAccount().getEmail());
                    dto.setFullName(bankAccount.getUserAccount().getFullName());
                    dto.setAccountType(bankAccount.getAccountType());
                    return dto;
                })
                .collect(Collectors.toList());

        // Create a new Page with the transformed content
        Page<BankAccountTableDto> dtoPage = new PageImpl<>(
                dtos, pageable, bankAccountPage.getTotalElements());

        return new PageResponseDto<>(dtoPage);

    }

    @Override
    public ResponeDto depositBankAccount(DepositFormDto depositFormDto) {
        BankAccount bankAccount = bankAccountRepository.findByAccountId(depositFormDto.getAccountId());
        if(bankAccount == null){
            return new ResponeDto("Nap tien khong thanh cong", 400);
        }
        bankAccount.setBalance(bankAccount.getBalance().add(depositFormDto.getAmount()));
        bankAccountRepository.save(bankAccount);

        UserAccount userAccount = bankAccount.getUserAccount();
        Notification notification = new Notification();
        notification.setTitle("Nap tien thanh cong");
        notification.setContent(depositFormDto.getDescription());
        notification.setType(NotificationType.INFO);
        notification.setUserAccount(userAccount);
        userAccount.getNotifications().add(notification);
        notificationRepository.save(notification);


        userAccountRepository.save(userAccount);
        return new ResponeDto("Nap tien thanh cong", 200);
    }


}
