package com.example.BankOnline.controller;

import com.example.BankOnline.dto.ApiResponseDto;
import com.example.BankOnline.dto.LoginDto;
import com.example.BankOnline.dto.RegisterDto;
import com.example.BankOnline.dto.ResponeDto;
import com.example.BankOnline.repository.UserAccountRepository;
import com.example.BankOnline.service.AuthService;
import com.example.BankOnline.service.AuthServiceImpl;
import com.example.BankOnline.utils.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    private final JwtUtil jwtUtil;
    private final UserAccountRepository userAccountRepository;

    public AuthController(AuthService authService, JwtUtil jwtUtil, UserAccountRepository userAccountRepository) {
        this.authService = authService;
        this.jwtUtil = jwtUtil;
        this.userAccountRepository = userAccountRepository;
    }

    /**
     * Endpoint đăng ký người dùng mới
     * POST /api/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<ResponeDto> register(@Valid @RequestBody RegisterDto registerDto) {
        ResponeDto response = authService.register(registerDto);
        if (response.getStatus() == 200) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    /**
     * Endpoint đăng nhập
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponseDto> login(@Valid @RequestBody LoginDto loginDto) {
        ApiResponseDto response = authService.login(loginDto);
        if (response.getStatus() == 200) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    /**
     * Endpoint làm mới Access Token
     * POST /api/auth/refresh-token
     * Body: { "refreshToken": "..." }
     */
    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponseDto> refreshToken(@RequestBody RefreshTokenDto refreshTokenDto) {
        ApiResponseDto response = jwtUtil.refreshToken(refreshTokenDto.getRefreshToken(),userAccountRepository);
        if (response.getStatus() == 200) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    /**
     * DTO cho refresh token
     */
    @lombok.Data
    public static class RefreshTokenDto {
        private String refreshToken;
    }
}