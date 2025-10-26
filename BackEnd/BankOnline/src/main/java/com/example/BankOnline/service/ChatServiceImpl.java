package com.example.BankOnline.service;

import com.example.BankOnline.entity.ChatHistory;
import com.example.BankOnline.entity.ChatMessage;
import com.example.BankOnline.repository.ChatHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ChatServiceImpl {

    @Autowired
    private ChatHistoryRepository chatHistoryRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // Lưu tin nhắn vào database
    @Transactional
    public void saveMessage(ChatMessage chatMessage) {
        ChatHistory chatHistory = new ChatHistory();
        chatHistory.setUserId(chatMessage.getUserId());
        chatHistory.setAdminId(chatMessage.getAdminId());
        chatHistory.setMessage(chatMessage.getMessage());
        chatHistory.setTimestamp(LocalDateTime.now());
        chatHistory.setSenderRole(chatMessage.getRole());
        chatHistory.setRead(false);
        chatHistoryRepository.save(chatHistory);
    }

    // Lấy lịch sử chat giữa user và admin
    public List<ChatHistory> getChatHistory(String userId, String adminId) {
        return chatHistoryRepository.findChatBetweenUsers(userId, adminId);
    }

    // Lấy danh sách tất cả user đã chat với admin
    public List<String> getAllUsersChatWithAdmin(String adminId) {
        return chatHistoryRepository.findAllUsersChatWithAdmin(adminId);
    }

    // Lấy tin nhắn cuối cùng của mỗi conversation
    public List<ChatHistory> getLastMessagesForAdmin(String adminId) {
        return chatHistoryRepository.findLastMessagesForAdmin(adminId);
    }

    // Đánh dấu tin nhắn đã đọc
    @Transactional
    public void markMessagesAsRead(String userId, String adminId) {
        List<ChatHistory> messages = chatHistoryRepository.findChatBetweenUsers(userId, adminId);
        messages.stream()
                .filter(msg -> msg.getAdminId().equals(adminId) && !msg.isRead())
                .forEach(msg -> msg.setRead(true));
        chatHistoryRepository.saveAll(messages);
    }

    // Đếm tin nhắn chưa đọc
    public long countUnreadMessages(String userId) {
        return chatHistoryRepository.countUnreadMessages(userId);
    }

    // Gửi tin nhắn realtime
    public void sendMessageToUser(String userId, ChatMessage message) {
        messagingTemplate.convertAndSend("/topic/messages/" + userId, message);
    }

    // Gửi tin nhắn đến admin
    public void sendMessageToAdmin(String adminId, ChatMessage message) {
        // gửi dến topic admin đã subscriber
        messagingTemplate.convertAndSend("/topic/admin/" + adminId, message);
    }
}