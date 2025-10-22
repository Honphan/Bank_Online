package com.example.BankOnline.dto;

import com.example.BankOnline.Enum.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationFormDto {
    private String title;
    private String content;
    private NotificationType notificationType;
    private String targetType;
    private String username;
}
