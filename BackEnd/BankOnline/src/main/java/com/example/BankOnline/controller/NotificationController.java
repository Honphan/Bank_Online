package com.example.BankOnline.controller;

import com.example.BankOnline.dto.NotificationFormDto;
import com.example.BankOnline.dto.ResponeDto;
import com.example.BankOnline.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api")
public class NotificationController {
    @Autowired
    private NotificationService notificationService;

    @PostMapping("/admin/notifications")
    public ResponeDto sendNotification(@RequestBody NotificationFormDto notificationFormDto) {
         return notificationService.sendNotification(notificationFormDto);
    }
}
