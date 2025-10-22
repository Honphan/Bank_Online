package com.example.BankOnline.service;

import com.example.BankOnline.Enum.AccountStatus;
import com.example.BankOnline.Enum.BankAccountType;
import com.example.BankOnline.Enum.Role;
import com.example.BankOnline.dto.ApiResponseDto;
import com.example.BankOnline.dto.JwtResponseDto;
import com.example.BankOnline.dto.LoginDto;
import com.example.BankOnline.dto.RegisterDto;
import com.example.BankOnline.dto.ResponeDto;
import com.example.BankOnline.entity.BankAccount;
import com.example.BankOnline.entity.UserAccount;
import com.example.BankOnline.repository.BankAccountRepository;
import com.example.BankOnline.repository.UserAccountRepository;
import com.example.BankOnline.security.UserDetailsImpl;
import com.example.BankOnline.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class AuthServiceImpl implements AuthService {
    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final BankAccountService bankAccountService;
    private final BankAccountRepository bankAccountRepository;

    @Autowired
    public AuthServiceImpl(UserAccountRepository userAccountRepository,
                           PasswordEncoder passwordEncoder,
                           JwtUtil jwtUtil,
                           AuthenticationManager authenticationManager, BankAccountService bankAccountService, BankAccountRepository bankAccountRepository) {
        this.userAccountRepository = userAccountRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
        this.bankAccountService = bankAccountService;
        this.bankAccountRepository = bankAccountRepository;
    }

    @Override
    public ResponeDto register(RegisterDto registerDto) {
        // Kiểm tra username đã tồn tại
        if (userAccountRepository.existsByUsername(registerDto.getUsername())) {
            return new ResponeDto("Tài khoản này đã có trong hệ thống", 400);
        }

        try {

            // Tạo UserAccount entity
            UserAccount userAccount = new UserAccount();
            userAccount.setUsername(registerDto.getUsername());
            userAccount.setEmail(registerDto.getEmail());
            userAccount.setPhoneNumber(registerDto.getPhoneNumber());
            userAccount.setFullName(registerDto.getFullName());
            userAccount.setPasswordHash(passwordEncoder.encode(registerDto.getPassword()));
            userAccount.setStatus(AccountStatus.ACTIVE);
            userAccount.setRole(Role.ROLE_USER);


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

    @Override
    public ApiResponseDto login(LoginDto loginDto) {
        try {
            // Xác thực thông qua AuthenticationManager
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginDto.getUsername(),
                            loginDto.getPassword()
                    )
            );

            // Lấy thông tin user đã xác thực
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();


            // Kiểm tra trạng thái tài khoản
            Optional<UserAccount> userAccountOpt = userAccountRepository.findByUsername(loginDto.getUsername());
            if (userAccountOpt.isEmpty() || userAccountOpt.get().getStatus() != AccountStatus.ACTIVE) {
                return new ApiResponseDto("Tài khoản đã bị khóa hoặc không hoạt động", 401, null, null);
            }

            UserAccount userAccount = userAccountOpt.get();

            // Tạo JWT token
            String accessToken = jwtUtil.generateToken(userDetails);
            String refreshToken = jwtUtil.generateRefreshToken(userDetails);

            // Cập nhật thời gian đăng nhập cuối
            userAccount.setLastLogin(new Date());
            userAccountRepository.save(userAccount);

            // Tạo response DTO chứa tokens
            JwtResponseDto jwtResponseDto = new JwtResponseDto(
                    accessToken,
                    refreshToken,
                    "Bearer",
                    userDetails.getUsername(),
                    userDetails.getAuthorities().stream()
                            .map(auth -> auth.getAuthority())
                            .toList()
            );

            return new ApiResponseDto("Đăng nhập thành công", 200, accessToken, jwtResponseDto);

        } catch (BadCredentialsException e) {
            return new ApiResponseDto("Tên đăng nhập hoặc mật khẩu không chính xác", 401, null, null);
        } catch (AuthenticationException e) {
            return new ApiResponseDto("Xác thực thất bại: " + e.getMessage(), 401, null, null);
        } catch (Exception e) {
            return new ApiResponseDto("Lỗi đăng nhập: " + e.getMessage(), 500, null, null);
        }
    }

}