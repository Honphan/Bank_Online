package com.example.BankOnline.service;

import com.example.BankOnline.dto.NotificationFormDto;
import com.example.BankOnline.dto.ResponeDto;
import com.example.BankOnline.entity.Notification;
import com.example.BankOnline.entity.UserAccount;
import com.example.BankOnline.repository.UserAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationServiceImpl implements NotificationService{
    @Autowired
    private UserAccountRepository userAccountRepository;

    @Override
    public ResponeDto sendNotification(NotificationFormDto notificationFormDto) {
        if(notificationFormDto.getTargetType().equals("ALL")){
            List<UserAccount> userAccountList = userAccountRepository.findAll();
            userAccountList.forEach(userAccount -> {
                Notification notification = new Notification();
                notification.setTitle(notificationFormDto.getTitle());
                notification.setContent(notificationFormDto.getContent());
                notification.setType(notificationFormDto.getNotificationType());
                notification.setUserAccount(userAccount);
                userAccount.getNotifications().add(notification);
                userAccountRepository.save(userAccount);
            });
        } else {
            UserAccount userAccount = userAccountRepository.findByUsername(notificationFormDto.getUsername()).get();
            Notification notification = new Notification();
            notification.setTitle(notificationFormDto.getTitle());
            notification.setContent(notificationFormDto.getContent());
            notification.setType(notificationFormDto.getNotificationType());
            notification.setUserAccount(userAccount);
            userAccount.getNotifications().add(notification);
            userAccountRepository.save(userAccount);
        }

        return new ResponeDto("thanh cong",200);
    }
}
