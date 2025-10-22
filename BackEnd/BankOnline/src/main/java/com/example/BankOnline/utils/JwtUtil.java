package com.example.BankOnline.utils;


import com.example.BankOnline.dto.ApiResponseDto;
import com.example.BankOnline.dto.JwtResponseDto;
import com.example.BankOnline.entity.UserAccount;
import com.example.BankOnline.repository.UserAccountRepository;
import com.example.BankOnline.security.UserDetailsImpl;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;

    @Value("${jwt.refresh-expiration}")
    private Long refreshExpiration;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }
    // Lấy username (subject) từ token
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }
    // Lấy thời gian hết hạn từ token
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
    //
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
    // So sánh thời gian hết hạn với thời gian hiện tại
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, userDetails.getUsername());
    }

    public String generateRefreshToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("type", "refresh");
        return createRefreshToken(claims, userDetails.getUsername());
    }

    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    private String createRefreshToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + refreshExpiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    public Boolean isRefreshToken(String token) {
        try {
            Claims claims = extractAllClaims(token);
            return "refresh".equals(claims.get("type"));
        } catch (Exception e) {
            return false;
        }
    }

    // Refresh lại refresh token
    public ApiResponseDto refreshToken(String refreshToken, UserAccountRepository userAccountRepository) {
        try {
            if (!isRefreshToken(refreshToken)) {
                return new ApiResponseDto("Refresh token không hợp lệ", 401, null, null);
            }

            String username = extractUsername(refreshToken);
            Optional<UserAccount> userAccountOpt = userAccountRepository.findByUsername(username);

            if (userAccountOpt.isEmpty()) {
                return new ApiResponseDto("Người dùng không tồn tại", 404, null, null);
            }

            UserAccount userAccount = userAccountOpt.get();
            UserDetailsImpl userDetails = new UserDetailsImpl(
                    userAccount.getUsername(),
                    userAccount.getPasswordHash(),
                    org.springframework.security.core.authority.AuthorityUtils
                            .createAuthorityList(userAccount.getRole().name())
            );

            String newAccessToken = generateToken(userDetails);

            JwtResponseDto jwtResponseDto = new JwtResponseDto(
                    newAccessToken,
                    refreshToken,
                    "Bearer",
                    username,
                    userDetails.getAuthorities().stream()
                            .map(auth -> auth.getAuthority())
                            .toList()
            );

            return new ApiResponseDto("Token làm mới thành công", 200, newAccessToken, jwtResponseDto);
        } catch (Exception e) {
            return new ApiResponseDto("Lỗi làm mới token: " + e.getMessage(), 401, null, null);
        }
    }
}
