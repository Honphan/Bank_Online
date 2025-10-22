package com.example.BankOnline.repository;

import com.example.BankOnline.Enum.BankAccountType;
import com.example.BankOnline.entity.BankAccount;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Map;

public interface BankAccountRepository extends JpaRepository<BankAccount, String> {
    boolean existsByAccountNumber(String accountNumber);
    BankAccount findByAccountNumber(String accountNumber);
    BankAccount findByAccountId(String accountId);
    @Query("SELECT b FROM BankAccount b JOIN b.userAccount u WHERE " +
            "(:status IS NULL OR :status = '' OR CAST(b.status AS string) = :status) AND " +
            "(:username IS NULL OR :username = '' OR LOWER(u.username) LIKE LOWER(CONCAT('%', :username, '%'))) AND " +
            "(:fullName IS NULL OR :fullName = '' OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :fullName, '%'))) AND " +
            "(:email IS NULL OR :email = '' OR LOWER(u.email) LIKE LOWER(CONCAT('%', :email, '%')))")
    Page<BankAccount> findBankAccountsByFilter(
            @Param("username") String username,
            @Param("status") String status,
            @Param("fullName") String fullName,
            @Param("email") String email,
            Pageable pageable);
}
