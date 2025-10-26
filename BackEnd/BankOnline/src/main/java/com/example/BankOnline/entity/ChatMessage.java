package com.example.BankOnline.entity;

import com.example.BankOnline.Enum.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {
    private String message;
    private String userId;
    private String adminId;
    private String time;
    private Role role;
}
