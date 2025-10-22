package com.example.BankOnline.repository;

import com.example.BankOnline.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface NotificationRepository extends JpaRepository<Notification, String> {

}
