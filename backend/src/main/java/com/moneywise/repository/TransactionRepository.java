package com.moneywise.repository;

import com.moneywise.model.Transaction;
import com.moneywise.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUser(User user);
    List<Transaction> findByUserAndType(User user, Transaction.TransactionType type);
    List<Transaction> findByUserAndCategory(User user, String category);
    List<Transaction> findByUserAndTransactionDateBetween(User user, LocalDate startDate, LocalDate endDate);
}
