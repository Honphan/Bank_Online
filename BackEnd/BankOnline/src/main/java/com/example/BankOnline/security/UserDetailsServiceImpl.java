package com.example.BankOnline.security;

import com.example.BankOnline.entity.UserAccount;
import com.example.BankOnline.repository.UserAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    // Inject UserRepository để lấy dữ liệu user từ database
    @Autowired
    private UserAccountRepository userRepository;

    @Override
    public UserDetailsImpl loadUserByUsername(String username) throws UsernameNotFoundException {
        // Tìm user trong database theo username
        UserAccount userAccount = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        // Trả về UserDetails object
        return  new UserDetailsImpl(
              userAccount.getUsername(),
               userAccount.getPasswordHash(),
                Collections.singletonList(new SimpleGrantedAuthority(userAccount.getRole().name()))
                );
    }
}
