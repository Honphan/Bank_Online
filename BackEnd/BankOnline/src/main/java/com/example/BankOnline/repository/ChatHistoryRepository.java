package com.example.BankOnline.repository;

import com.example.BankOnline.entity.ChatHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatHistoryRepository extends JpaRepository<ChatHistory, Long> {

    // Lấy lịch sử chat giữa 2 người
    @Query("SELECT c FROM ChatHistory c WHERE " +
            "(c.userId = :userId AND c.adminId = :adminId) OR " +
            "(c.userId = :adminId AND c.adminId = :userId) " +
            "ORDER BY c.timestamp ASC")
    List<ChatHistory> findChatBetweenUsers(@Param("userId") String userId,
                                           @Param("adminId") String adminId);

    // Lấy danh sách user đã chat với admin (distinct)
    @Query("SELECT DISTINCT CASE " +
            "WHEN c.senderRole = 'USER' THEN c.userId " +
            "ELSE c.adminId END " +
            "FROM ChatHistory c WHERE " +
            "c.userId = :adminId OR c.adminId = :adminId")
    List<String> findAllUsersChatWithAdmin(@Param("adminId") String adminId);

    // Lấy tin nhắn cuối cùng của mỗi conversation
    @Query("SELECT c FROM ChatHistory c WHERE c.id IN " +
            "(SELECT MAX(c2.id) FROM ChatHistory c2 WHERE " +
            "(c2.userId = :adminId OR c2.adminId = :adminId) " +
            "GROUP BY CASE WHEN c2.senderRole = 'USER' THEN c2.userId ELSE c2.adminId END)")
    List<ChatHistory> findLastMessagesForAdmin(@Param("adminId") String adminId);

    // Đếm tin nhắn chưa đọc
    @Query("SELECT COUNT(c) FROM ChatHistory c WHERE " +
            "c.adminId = :userId AND c.isRead = false")
    long countUnreadMessages(@Param("userId") String userId);
}