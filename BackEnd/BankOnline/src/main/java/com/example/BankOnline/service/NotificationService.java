package com.example.BankOnline.service;

import com.example.BankOnline.dto.NotificationFormDto;
import com.example.BankOnline.dto.ResponeDto;

public interface NotificationService {
    ResponeDto sendNotification(NotificationFormDto notificationFormDto);
}
