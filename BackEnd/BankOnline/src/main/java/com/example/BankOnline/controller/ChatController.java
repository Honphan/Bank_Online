package com.example.BankOnline.controller;

import com.example.BankOnline.entity.ChatHistory;
import com.example.BankOnline.entity.ChatMessage;
import com.example.BankOnline.service.ChatService;
import com.example.BankOnline.service.ChatServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class ChatController {

    @Autowired
    private ChatServiceImpl chatService;

    // WebSocket endpoint - User gửi tin nhắn đến Admin
    @MessageMapping("/chat.user")
    public void userSendMessage(@Payload ChatMessage chatMessage) {
        try {
            // Lưu vào database
            chatService.saveMessage(chatMessage);

            // Gửi realtime đến admin
            chatService.sendMessageToAdmin(chatMessage.getAdminId(), chatMessage);

            System.out.println("User message sent: " + chatMessage.getMessage());
        } catch (Exception e) {
            System.err.println("Error sending user message: " + e.getMessage());
        }
    }

    // WebSocket endpoint - Admin gửi tin nhắn đến User
    @MessageMapping("/chat.admin")
    public void adminSendMessage(@Payload ChatMessage chatMessage) {
        try {
            // Lưu vào database
            chatService.saveMessage(chatMessage);

            // Gửi realtime đến user
            chatService.sendMessageToUser(chatMessage.getAdminId(), chatMessage);

            System.out.println("Admin message sent: " + chatMessage.getMessage());
        } catch (Exception e) {
            System.err.println("Error sending admin message: " + e.getMessage());
        }
    }

    // REST API - Lấy lịch sử chat
    @GetMapping("/api/chat/history")
    public ResponseEntity<?> getChatHistory(
            @RequestParam String userId,
            @RequestParam String adminId) {
        try {
            List<ChatHistory> history = chatService.getChatHistory(userId, adminId);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // REST API - Lấy danh sách user đã chat (cho admin)
    @GetMapping("/api/admin/chat/users")
    public ResponseEntity<?> getUsersList(@RequestParam String adminId) {
        try {
            List<String> users = chatService.getAllUsersChatWithAdmin(adminId);
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // REST API - Lấy tin nhắn cuối cùng của mỗi conversation
    @GetMapping("/api/admin/chat/conversations")
    public ResponseEntity<?> getConversations(@RequestParam String adminId) {
        try {
            List<ChatHistory> conversations = chatService.getLastMessagesForAdmin(adminId);
            return ResponseEntity.ok(conversations);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // REST API - Đánh dấu tin nhắn đã đọc
    @PostMapping("/api/chat/mark-read")
    public ResponseEntity<?> markAsRead(
            @RequestParam String userId,
            @RequestParam String adminId) {
        try {
            chatService.markMessagesAsRead(userId, adminId);
            return ResponseEntity.ok("Messages marked as read");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // REST API - Đếm tin nhắn chưa đọc
    @GetMapping("/api/chat/unread-count")
    public ResponseEntity<?> getUnreadCount(@RequestParam String userId) {
        try {
            long count = chatService.countUnreadMessages(userId);
            Map<String, Long> response = new HashMap<>();
            response.put("unreadCount", count);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}