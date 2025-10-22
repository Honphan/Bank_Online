package com.example.BankOnline.security;


import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Set;

@Component
public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, jakarta.servlet.ServletException {

        // Lấy danh sách roles của user
        Set<String> roles = AuthorityUtils.authorityListToSet(authentication.getAuthorities());

        // Redirect dựa trên role
        if (roles.contains("ROLE_ADMIN")) {
            response.sendRedirect("/admin/dashboard");
        }  else {
            response.sendRedirect("/dashboard");
        }
    }
}