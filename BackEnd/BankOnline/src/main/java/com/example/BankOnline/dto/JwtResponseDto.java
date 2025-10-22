package com.example.BankOnline.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JwtResponseDto {
    private String accessToken;
    private String refreshToken;
    private String tokenType;      // "Bearer"
    private String username;
    private List<String> roles;

    public JwtResponseDto(String accessToken, String refreshToken, String tokenType, String username) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.tokenType = tokenType;
        this.username = username;
    }
}
